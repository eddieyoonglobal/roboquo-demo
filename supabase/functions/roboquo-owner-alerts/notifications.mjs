/**
 * RoboQuo owner-only notification adapter.
 * STAGED / NOT ACTIVATED: provider credentials and owner consent are required.
 *
 * Accepts an authenticated Supabase Database Webhook for a newly inserted
 * marketplace_messages row. Sends a minimal alert, not customer chat content.
 * No service-role keys, personal data or Kakao/LINE credentials in source.
 */
export const DEFAULT_LINK="https://roboquo.com/#robots";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validMessageEvent(event){
  return !!(event && event.type==="INSERT" &&
    event.schema==="public" && event.table==="marketplace_messages" &&
    event.record && typeof event.record==="object" &&
    UUID.test(String(event.record.id||"")) &&
    UUID.test(String(event.record.conversation_id||"")));
}
function compareSecret(a,b){
  if(!a || !b || a.length!==b.length)return false;
  // Equal length + loop avoids a direct string early-exit on prefix.
  let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);
  return d===0;
}
export function messageText(){
  return "🔔 RoboQuo 새 거래 메시지\n새 문의가 도착했습니다.\nRoboQuo에 로그인해 내용을 확인하세요.";
}
export function kakaoTemplate(){
  return {object_type:"text",text:messageText(),link:{
    web_url:DEFAULT_LINK,mobile_web_url:DEFAULT_LINK
  },button_title:"RoboQuo에서 확인"};
}
export async function sendLine({token,to,messageId,fetchImpl=fetch}){
  if(!token||!to)return {skipped:true,provider:"LINE"};
  if(!/^U[0-9a-f]{32}$/i.test(to))throw Error("LINE recipient ID format invalid");
  const response=await fetchImpl("https://api.line.me/v2/bot/message/push",{
    method:"POST",
    headers:{
      "Authorization":"Bearer "+token,
      "Content-Type":"application/json",
      "X-Line-Retry-Key":messageId
    },
    body:JSON.stringify({to,messages:[{type:"text",text:messageText()+"\n"+DEFAULT_LINK}]}),
    signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw Error("LINE send HTTP "+response.status);
  return {provider:"LINE",accepted:true};
}
export async function sendKakao({accessToken,fetchImpl=fetch}){
  if(!accessToken)return {skipped:true,provider:"Kakao"};
  const form=new URLSearchParams({template_object:JSON.stringify(kakaoTemplate())});
  const response=await fetchImpl("https://kapi.kakao.com/v2/api/talk/memo/default/send",{
    method:"POST",
    headers:{
      "Authorization":"Bearer "+accessToken,
      "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
    },
    body:form.toString(),
    signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw Error("Kakao send HTTP "+response.status);
  const data=await response.json();
  if(data?.result_code!==0)throw Error("Kakao send rejected");
  return {provider:"Kakao",accepted:true};
}
export function makeHandler({getEnv,fetchImpl=fetch}){
  return async function handler(request){
    if(request.method!=="POST")return new Response("Method Not Allowed",{status:405});
    const enabled=getEnv("ROBOQUO_OWNER_ALERTS_ENABLED")==="true";
    const secret=getEnv("ROBOQUO_OWNER_ALERT_WEBHOOK_SECRET")||"";
    if(!enabled||secret.length<32)return Response.json({status:"not_configured"},{status:503});
    const supplied=request.headers.get("x-roboquo-owner-alert-secret")||"";
    if(!compareSecret(secret,supplied))return new Response("Unauthorized",{status:401});
    const raw=await request.text();
    if(raw.length>16000)return new Response("Payload too large",{status:413});
    let event;
    try{event=JSON.parse(raw);}catch{return new Response("Bad Request",{status:400});}
    if(!validMessageEvent(event))return Response.json({ignored:true});
    const messageId=event.record.id;
    const channels=[];
    const lineToken=getEnv("LINE_OWNER_CHANNEL_ACCESS_TOKEN")||"";
    const lineUser=getEnv("LINE_OWNER_USER_ID")||"";
    const kakaoToken=getEnv("KAKAO_OWNER_ACCESS_TOKEN")||"";
    if(lineToken&&lineUser)channels.push(
      sendLine({token:lineToken,to:lineUser,messageId,fetchImpl}).catch(e=>({provider:"LINE",error:e.message}))
    );
    if(kakaoToken)channels.push(
      sendKakao({accessToken:kakaoToken,fetchImpl}).catch(e=>({provider:"Kakao",error:e.message}))
    );
    if(!channels.length)return Response.json({status:"no_recipients"},{status:503});
    const results=await Promise.all(channels);
    // Never include credentials, raw chat text, seller PII, or API bodies in logs.
    const attempted=results.length;
    const accepted=results.filter(r=>r.accepted).length;
    const failed=results.filter(r=>r.error).map(r=>r.provider);
    if(failed.length)console.warn("RoboQuo owner notification: provider failure",failed.join(","));
    // Do not retry the whole webhook on partial success (avoids Kakao duplicates).
    return Response.json({status:accepted===attempted?"accepted":"partial",attempted,accepted,failed});
  };
}
