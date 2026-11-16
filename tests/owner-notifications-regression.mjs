/* Offline-only notification regression. Never sends to real LINE or Kakao. */
import assert from "node:assert/strict";
import {makeHandler,validMessageEvent,kakaoTemplate,messageText} from "../supabase/functions/roboquo-owner-alerts/notifications.mjs";
const secret="test-only-shared-secret-with-40-characters-minimum";
const messageId="6a891190-2a8c-4a85-b500-24ce6e1285df";
const conversationId="7e840bfd-a730-432d-9ff3-a236236a7a1d";
const event={type:"INSERT",schema:"public",table:"marketplace_messages",
 record:{id:messageId,conversation_id:conversationId,body:"PRIVATE CUSTOMER PHONE +81-90-1234-5678",sender_id:"private-user"}};
const uri="https://roboquo.com/#robots";
const getEnv=env=>name=>env[name];
const req=(body,token=secret)=>new Request("https://example.supabase.co/functions/v1/roboquo-owner-alerts",{
 method:"POST",headers:{"x-roboquo-owner-alert-secret":token,"content-type":"application/json"},
 body:JSON.stringify(body)});
assert(validMessageEvent(event));
assert(!validMessageEvent({...event,type:"UPDATE"}));
assert(!validMessageEvent({...event,table:"profiles"}));
assert(!validMessageEvent({...event,record:{id:"fake"}}));
assert(kakaoTemplate().text.length<=200);
assert.equal(kakaoTemplate().link.web_url,uri);
assert(!messageText().includes("PRIVATE CUSTOMER"));
let calls=[];
const fakeFetch=async (url,options)=>{
 calls.push({url,options});
 if(url.includes("kapi.kakao.com"))return new Response(JSON.stringify({result_code:0}),{status:200});
 if(url.includes("api.line.me"))return new Response("",{status:200});
 throw Error("Unexpected network target");
};
const handler=makeHandler({getEnv:getEnv({
 ROBOQUO_OWNER_ALERTS_ENABLED:"true",
 ROBOQUO_OWNER_ALERT_WEBHOOK_SECRET:secret,
 LINE_OWNER_CHANNEL_ACCESS_TOKEN:"unit-test-line-token",
 LINE_OWNER_USER_ID:"U"+"a".repeat(32),
 KAKAO_OWNER_ACCESS_TOKEN:"unit-test-kakao-user-token"
}),fetchImpl:fakeFetch});
let res=await handler(req(event,"WRONG"));
assert.equal(res.status,401,"webhook must be authenticated");
assert.equal(calls.length,0);
res=await handler(req({...event,table:"profiles"}));
assert.equal(res.status,200);
assert.deepEqual(await res.json(),{ignored:true});
assert.equal(calls.length,0);
res=await handler(req(event));
assert.equal(res.status,200);
assert.deepEqual(await res.json(),{status:"accepted",attempted:2,accepted:2,failed:[]});
assert.equal(calls.length,2);
const line=calls.find(x=>x.url.includes("line.me")),kakao=calls.find(x=>x.url.includes("kapi.kakao.com"));
assert(line&&kakao,"both configured providers must receive one notification");
assert.equal(line.options.headers["X-Line-Retry-Key"],messageId,"LINE retries use source UUID");
assert.equal(JSON.parse(line.options.body).to,"U"+"a".repeat(32));
const kForm=new URLSearchParams(kakao.options.body);
assert.equal(JSON.parse(kForm.get("template_object")).object_type,"text");
for(const c of calls){
 assert(!c.options.body.includes("PRIVATE CUSTOMER"),"no raw customer chat text to messenger");
 assert(!c.options.body.includes("+81-90-1234-5678"),"no private phone number");
 assert(c.options.body.includes("RoboQuo"));
}
const notReady=makeHandler({getEnv:getEnv({ROBOQUO_OWNER_ALERTS_ENABLED:"false",ROBOQUO_OWNER_ALERT_WEBHOOK_SECRET:secret}),fetchImpl:()=>{throw Error("must never run");}});
assert.equal((await notReady(req(event))).status,503,"connection is opt-in and disabled by default");
const noTargets=makeHandler({getEnv:getEnv({ROBOQUO_OWNER_ALERTS_ENABLED:"true",ROBOQUO_OWNER_ALERT_WEBHOOK_SECRET:secret}),fetchImpl:()=>{throw Error("no messages");}});
assert.equal((await noTargets(req(event))).status,503,"cannot claim sending without recipients");
const invalidMethod=await handler(new Request("https://example.supabase.co/functions/v1/roboquo-owner-alerts"));
assert.equal(invalidMethod.status,405);
console.log("PASS owner alerts: 2 signed/opt-in providers, correct official APIs, no PII, disabled by default");
