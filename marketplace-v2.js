/* RoboQuo Classifieds — real robots and parts, photo-first posting and private messages.
 * Requires database/006_real_classifieds_marketplace.sql. No payment processing.
 * This browser module never contains a Supabase service-role key. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const lang=()=>document.documentElement.lang||'en';
const L={
 en:{market:'Used robots & parts',browse:'Browse actual listings',post:'Post an item',inbox:'Messages',preview:'Development Preview: publishing to the live database is disabled.',none:'Sign in to send a message or publish a listing.',login:'Sign in',category:'Category',title:'Item title / model',brand:'Brand / manufacturer',condition:'Condition',price:'Asking price (JPY)',location:'Location',description:'Description (included items, defects, history)',images:'Product photos (1–8, max 15 MB each)',name:'Seller name / company',email:'Contact email (private)',phone:'Contact number (private)',declaration:'I own the item or am authorized to sell it and have described its condition accurately.',publish:'Publish listing',publishing:'Publishing...',published:'Your listing is now live.',saveError:'Could not publish. Check the details and database setup.',required:'Fill all required fields and attach at least one supported photo.',close:'Close',contact:'Message seller',offer:'Offer / inquiry',message:'Your message',send:'Send message',sendError:'Message could not be delivered. Verify sign-in and marketplace DB setup.',sent:'Message sent to the seller.',thread:'Conversation',reply:'Reply',emptyInbox:'No conversations yet.',loadError:'Could not load messages. The marketplace database update may not be installed.',priceHint:'Price negotiation only. RoboQuo does not charge or hold payments.',askPrice:'Price inquiry',photosHint:'Actual photos, not stock images',all:'All items'},
 ko:{market:'중고 로봇·부품 거래',browse:'실제 등록 매물 보기',post:'상품 등록',inbox:'내 채팅',preview:'개발 Preview에서는 운영 DB에 매물을 게시할 수 없습니다.',none:'매물 등록과 판매자 채팅에는 로그인이 필요합니다.',login:'로그인',category:'판매 카테고리',title:'상품명 / 모델명',brand:'제조사 / 브랜드',condition:'상품 상태',price:'판매 희망 가격 (엔)',location:'거래 지역',description:'상품 설명 (포함품, 하자, 사용 이력)',images:'실제 상품 사진 (1~8장, 장당 15MB 이내)',name:'판매자 이름 / 상호',email:'연락 이메일 (비공개)',phone:'연락 전화번호 (비공개)',declaration:'본인 소유이거나 판매 권한이 있으며, 상품 상태를 사실대로 기재했습니다.',publish:'상품 게시하기',publishing:'상품 등록 중...',published:'매물이 공개되었습니다.',saveError:'등록에 실패했습니다. 입력 정보와 DB 설정을 확인하세요.',required:'필수 항목과 실제 상품 사진을 확인하세요.',close:'닫기',contact:'판매자에게 채팅',offer:'가격 제안·문의',message:'판매자에게 보낼 메시지',send:'메시지 보내기',sendError:'메시지를 전달하지 못했습니다. 로그인 또는 DB 설정을 확인하세요.',sent:'판매자에게 메시지를 보냈습니다.',thread:'거래 대화',reply:'답장',emptyInbox:'아직 거래 메시지가 없습니다.',loadError:'메시지를 불러오지 못했습니다. 마켓 DB 업데이트가 필요할 수 있습니다.',priceHint:'판매자와 가격을 협의하세요. RoboQuo는 결제나 예치금을 처리하지 않습니다.',askPrice:'가격 문의',photosHint:'판매 상품의 실제 사진을 올려주세요.',all:'전체 상품'},
 ja:{market:'中古ロボット・部品の売買',browse:'実際の出品を見る',post:'商品を出品',inbox:'取引メッセージ',preview:'開発プレビューでは、本番データベースへの出品を無効にしています。',none:'出品・メッセージにはログインが必要です。',login:'ログイン',category:'出品カテゴリー',title:'商品名・型番',brand:'メーカー・ブランド',condition:'商品状態',price:'希望価格（円）',location:'所在地・取引地域',description:'商品説明（付属品、不具合、使用履歴）',images:'実物写真（1～8枚、1枚15MB以内）',name:'出品者名・会社名',email:'連絡先メール（非公開）',phone:'連絡先電話（非公開）',declaration:'所有者または販売権限があり、商品の状態を正確に記載しました。',publish:'出品を公開する',publishing:'公開中…',published:'商品が公開されました。',saveError:'出品できませんでした。入力内容とDB設定をご確認ください。',required:'必須項目と実物写真をご確認ください。',close:'閉じる',contact:'出品者にメッセージ',offer:'価格交渉・お問い合わせ',message:'出品者へのメッセージ',send:'メッセージを送る',sendError:'メッセージを送信できませんでした。ログインまたはDB設定をご確認ください。',sent:'出品者にメッセージを送信しました。',thread:'取引メッセージ',reply:'返信',emptyInbox:'メッセージはまだありません。',loadError:'メッセージを表示できません。DBの更新が必要な可能性があります。',priceHint:'支払いは当事者間で確認してください。RoboQuoは決済・預かり金に対応していません。',askPrice:'価格のお問い合わせ',photosHint:'ストック画像ではなく実物写真をご登録ください。',all:'すべての商品'}
};
const C={
 en:{robot:'Robot',gripper:'Gripper / EOAT',controller:'Controller',vision:'Vision / sensor',part:'Robot part',accessory:'Peripheral / accessory',other:'Other'},
 ko:{robot:'로봇 본체',gripper:'그리퍼·EOAT',controller:'컨트롤러',vision:'비전·센서',part:'로봇 부품',accessory:'주변기기',other:'기타'},
 ja:{robot:'ロボット本体',gripper:'グリッパー・EOAT',controller:'コントローラー',vision:'ビジョン・センサー',part:'ロボット部品',accessory:'周辺機器',other:'その他'}
};
const CONDITIONS={
 en:{used:'Used',new:'New',refurbished:'Refurbished',for_parts:'For parts / faulty'},
 ko:{used:'중고',new:'신품',refurbished:'정비·리퍼',for_parts:'부품용·고장'},
 ja:{used:'中古',new:'新品',refurbished:'整備済み',for_parts:'部品取り・故障'}
};
const tr=k=>(L[lang()]||L.en)[k]||L.en[k]||k;
const cat=k=>(C[lang()]||C.en)[k]||C.en[k]||k;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
const api=()=>window.rqSupabase||null;
const user=()=>window.rqAuthSession?.user||null;
let files=[],activeThread='',busy=false;
const photoTypes=new Set(['image/jpeg','image/png','image/webp','image/heic','image/heif']);
function notice(message){if(typeof window.toast==='function')window.toast(message);else alert(message)}
function modal(content){openModal('<div class="rq-classifieds-modal">'+content+'</div>')}
function authRequired(){if(user())return false;window.rqRequireAuth?.('generic',tr('login'));return true}
function field(label,name,opts){
 opts=opts||{};
 return '<label class="rq-cl-field"><span>'+esc(label)+(opts.required?' *':'')+'</span><input name="'+esc(name)+'" type="'+esc(opts.type||'text')+'" '+(opts.required?'required ':'')+(opts.placeholder?'placeholder="'+esc(opts.placeholder)+'" ':'')+'value="'+esc(opts.value||'')+'" '+(opts.min?'min="'+opts.min+'" ':'')+'></label>';
}
function choices(obj,selected){return Object.entries(obj).map(([key,value])=>'<option value="'+key+'" '+(key===selected?'selected':'')+'>'+esc(value)+'</option>').join('')}
function categoryTiles(){
 let container=$('#rqMarketCategoryChips');
 if(!container){
  container=document.createElement('nav');container.id='rqMarketCategoryChips';container.className='rq-market-chips';
  const toolbar=$('#robots .market-toolbar');if(toolbar)toolbar.insertAdjacentElement('beforebegin',container);
 }
 container.innerHTML='<button type="button" data-filter="" class="active">'+esc(tr('all'))+'</button>'+
   Object.keys(C.en).map(k=>'<button type="button" data-filter="'+k+'">'+esc(cat(k))+'</button>').join('');
 container.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  const filter=$('#categoryFilter');
  window.rqRenderMarketplace?.(); // restore the classifieds options if legacy code rebuilt the select
  if(filter){
   filter.value=b.dataset.filter;
   filter.dispatchEvent(new Event('change',{bubbles:true}));
   window.rqRenderMarketplace?.();
  }
  container.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
 }));
}
function putMarketActions(){
 let head=$('#robots .page-head');
 if(head&&!$('#rqMarketInboxBtn')){
  const btn=document.createElement('button');btn.id='rqMarketInboxBtn';btn.type='button';btn.className='secondary';btn.textContent=tr('inbox');btn.addEventListener('click',openInbox);
  head.appendChild(btn);
 }
 if(head&&!$('#rqMarketInfo')){
  const p=document.createElement('p');p.id='rqMarketInfo';p.className='rq-market-subtitle';p.textContent=tr('priceHint');head.insertAdjacentElement('afterend',p);
 }
 categoryTiles();
}
function showSell(initialCat){
 files=[];
 const account=user();
 const meta=account?.user_metadata||{};
 const initial=initialCat&&C.en[initialCat]?initialCat:'robot';
 const html=[
 '<div class="rq-cl-head"><h2>'+esc(tr('post'))+'</h2><p>'+esc(tr('photosHint'))+'</p></div>',
 '<form id="rqQuickSellForm" class="rq-classifieds-form">',
 '<div class="rq-cl-pictures"><label>'+esc(tr('images'))+' *<input id="rqClPhotos" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" required></label><div id="rqClPreview" class="rq-cl-pictures-grid"></div></div>',
 '<div class="rq-cl-columns">',
 '<label class="rq-cl-field"><span>'+esc(tr('category'))+' *</span><select name="itemCategory" required>'+choices(C[lang()]||C.en,initial)+'</select></label>',
 '<label class="rq-cl-field"><span>'+esc(tr('condition'))+' *</span><select name="itemCondition" required>'+choices(CONDITIONS[lang()]||CONDITIONS.en,'used')+'</select></label>',
 field(tr('title'),'model',{required:true,placeholder:'FANUC CRX-10iA / RG2 / R-30iB'}),
 field(tr('brand'),'maker',{placeholder:'FANUC / OnRobot'}),
 field(tr('price'),'price',{type:'number',min:'0',placeholder:'250000'}),
 field(tr('location'),'location',{required:true,placeholder:'Tokyo / Osaka'}),
 '</div>',
 '<label class="rq-cl-field"><span>'+esc(tr('description'))+' *</span><textarea name="description" required rows="4" maxlength="5000"></textarea></label>',
 '<div class="rq-cl-columns">',
 field(tr('name'),'companyName',{required:true,value:meta.company_name||meta.display_name||''}),
 field(tr('email'),'contactEmail',{required:true,type:'email',value:account?.email||''}),
 field(tr('phone'),'contactPhone',{required:true,type:'tel',value:meta.phone||''}),
 '</div>',
 '<label class="rq-cl-consent"><input type="checkbox" name="declared" required><span>'+esc(tr('declaration'))+'</span></label>',
 '<p class="rq-cl-disclaimer">'+esc(tr('priceHint'))+'</p>',
 '<p id="rqClStatus" role="status" aria-live="polite"></p>',
 '<div class="rq-cl-actions"><button type="button" class="secondary" id="rqClCancel">'+esc(tr('close'))+'</button><button type="submit" class="primary" id="rqClSubmit">'+esc(tr('publish'))+'</button></div>',
 '</form>'
 ].join('');
 modal(html);
 const form=$('#rqQuickSellForm');
 $('#rqClCancel')?.addEventListener('click',()=>window.closeModal?.());
 $('#rqClPhotos')?.addEventListener('change',e=>{
  files=[...(e.target.files||[])];
  const previews=$('#rqClPreview');previews.replaceChildren();
  files.slice(0,8).forEach(file=>{
   const img=document.createElement('img');img.alt=file.name;img.src=URL.createObjectURL(file);
   img.onload=()=>URL.revokeObjectURL(img.src);previews.appendChild(img);
  });
 });
 form.addEventListener('submit',submitListing);
}
async function submitListing(event){
 event.preventDefault();if(busy)return;
 const form=event.currentTarget,status=$('#rqClStatus'),btn=$('#rqClSubmit');
 const data=Object.fromEntries(new FormData(form).entries());
 if(files.length<1||files.length>8||!data.declared||!data.model?.trim()||!data.description?.trim()||!data.companyName?.trim()||!data.contactEmail?.trim()||!data.contactPhone?.trim()){
  status.textContent=tr('required');return;
 }
 const photos=[];
 for(let i=0;i<files.length;i++){
  const file=files[i];
  const type=file.type||({'jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png','webp':'image/webp','heic':'image/heic','heif':'image/heif'}[file.name.split('.').pop().toLowerCase()]||'');
  if(!photoTypes.has(type)||file.size<1||file.size>15728640){status.textContent=tr('required');return}
  photos.push({slot:i===0?'overall':'extra'+i,blob:file,name:file.name,type,size:file.size});
 }
 if(window.rqCanWriteSupabase?.()===false){status.textContent=tr('preview');return}
 if(authRequired()){status.textContent=tr('none');return}
 busy=true;btn.disabled=true;btn.textContent=tr('publishing');
 try{
  const draft={...data,contactName:data.companyName,country:'Japan',sale:'fixed',working:'unknown',declared:true};
  await window.rqSubmitSellerListing(draft,{photos});
  window.closeModal?.();
  notice(tr('published'));
  route('robots');
 }catch(error){
  console.warn('RoboQuo listing failed',error?.code||'unknown');
  status.textContent=error?.code==='PREVIEW_READ_ONLY'?tr('preview'):tr('saveError');
 }finally{busy=false;btn.disabled=false;btn.textContent=tr('publish')}
}
function findRealListing(id){
 const all=typeof allRobotListings==='function'?allRobotListings():[];
 return all.find(r=>String(r.id)===String(id)&&r._source==='seller-supabase');
}
function askSeller(id,intent){
 const listing=findRealListing(id);if(!listing)return;
 const title=[listing.brand,listing.model].filter(Boolean).join(' ');
 modal('<h2>'+esc(title)+'</h2><p class="rq-cl-disclaimer">'+esc(tr('priceHint'))+'</p>'+
  '<form id="rqAskForm" class="rq-classifieds-form">'+
  '<label class="rq-cl-field"><span>'+esc(tr('message'))+'</span><textarea name="body" rows="5" required maxlength="2000" placeholder="'+esc(intent==='offer'?tr('askPrice'):tr('message'))+'"></textarea></label>'+
  '<p id="rqClStatus" role="status" aria-live="polite"></p>'+
  '<div class="rq-cl-actions"><button type="button" class="secondary" id="rqClCancel">'+esc(tr('close'))+'</button><button class="primary" type="submit">'+esc(tr('send'))+'</button></div></form>');
 $('#rqClCancel')?.addEventListener('click',()=>window.closeModal?.());
 $('#rqAskForm')?.addEventListener('submit',e=>sendFirstMessage(e,listing));
}
async function sendFirstMessage(e,listing){
 e.preventDefault();
 const status=$('#rqClStatus'),form=e.currentTarget,send=form.querySelector('[type="submit"]');
 if(authRequired()){status.textContent=tr('none');return}
 const text=String(new FormData(form).get('body')||'').trim();
 if(text.length<1||text.length>2000)return;
 const client=api(),account=user();if(!client||!account)return;
 send.disabled=true;
 try{
  // Authenticated browser users can read owner_id; anon users cannot.
  const details=await client.from('seller_listings').select('id,owner_id,status').eq('id',listing.backendId).single();
  if(details.error||details.data?.status!=='published')throw details.error||new Error('Not available');
  if(details.data.owner_id===account.id)throw new Error('Seller cannot message themselves');
  let check=await client.from('marketplace_conversations').select('id').eq('listing_id',listing.backendId).eq('buyer_id',account.id).maybeSingle();
  if(check.error)throw check.error;
  let conversationId=check.data?.id;
  if(!conversationId){
   const created=await client.from('marketplace_conversations').insert({listing_id:listing.backendId,buyer_id:account.id,seller_id:details.data.owner_id}).select('id').single();
   if(created.error){
    // Concurrent first messages can hit the UNIQUE(listing_id,buyer_id) constraint.
    if(created.error.code!=='23505')throw created.error;
    check=await client.from('marketplace_conversations').select('id').eq('listing_id',listing.backendId).eq('buyer_id',account.id).maybeSingle();
    if(check.error||!check.data?.id)throw check.error||new Error('Conversation unavailable');
    conversationId=check.data.id;
   }else conversationId=created.data.id;
  }
  const sent=await client.from('marketplace_messages').insert({conversation_id:conversationId,sender_id:account.id,body:text});
  if(sent.error)throw sent.error;
  notice(tr('sent'));await openThread(conversationId);
 }catch(error){console.warn('RoboQuo marketplace message error',error?.code||'request_failed');status.textContent=tr('sendError')}
 finally{send.disabled=false}
}
async function openInbox(){
 if(authRequired())return;
 const client=api();
 modal('<h2>'+esc(tr('inbox'))+'</h2><div id="rqClInbox">'+esc(tr('browse'))+'</div>');
 const result=await client.from('marketplace_conversations')
  .select('id,listing_id,buyer_id,seller_id,created_at,seller_listings(manufacturer,model,item_category)')
  .order('created_at',{ascending:false}).limit(100);
 const mount=$('#rqClInbox');if(!mount)return;
 if(result.error){mount.textContent=tr('loadError');return}
 const conversations=result.data||[];
 if(!conversations.length){mount.textContent=tr('emptyInbox');return}
 mount.innerHTML=conversations.map(row=>{
  const item=row.seller_listings||{};
  return '<button type="button" class="rq-cl-thread-link" data-id="'+esc(row.id)+'">'+esc([item.manufacturer,item.model].filter(Boolean).join(' ')||tr('thread'))+
   '<small>'+esc(new Date(row.created_at).toLocaleDateString())+'</small></button>'
 }).join('');
 mount.querySelectorAll('button[data-id]').forEach(b=>b.addEventListener('click',()=>openThread(b.dataset.id)));
}
async function openThread(id){
 if(authRequired())return;
 const client=api(),account=user();
 const allowed=await client.from('marketplace_conversations').select('id,listing_id,buyer_id,seller_id,seller_listings(manufacturer,model)').eq('id',id).single();
 if(allowed.error){notice(tr('loadError'));return}
 activeThread=id;
 const history=await client.from('marketplace_messages').select('id,body,sender_id,created_at').eq('conversation_id',id).order('created_at',{ascending:true});
 if(history.error){notice(tr('loadError'));return}
 const product=allowed.data?.seller_listings||{},title=[product.manufacturer,product.model].filter(Boolean).join(' ')||tr('thread');
 modal('<div class="rq-cl-thread"><h2>'+esc(title)+'</h2><div class="rq-cl-messages" id="rqThreadMessages">'+
  (history.data||[]).map(msg=>'<div class="rq-cl-bubble '+(msg.sender_id===account.id?'mine':'')+'">'+esc(msg.body)+'<small>'+esc(new Date(msg.created_at).toLocaleString())+'</small></div>').join('')+
  '</div><form id="rqThreadReply" class="rq-cl-reply"><textarea name="body" maxlength="2000" rows="3" required placeholder="'+esc(tr('reply'))+'"></textarea><button type="submit" class="primary">'+esc(tr('send'))+'</button></form><p id="rqClStatus" role="status" aria-live="polite"></p></div>');
 $('#rqThreadReply')?.addEventListener('submit',async e=>{
  e.preventDefault();const body=String(new FormData(e.currentTarget).get('body')||'').trim();
  if(!body)return;
  const saved=await client.from('marketplace_messages').insert({conversation_id:activeThread,sender_id:account.id,body});
  if(saved.error){$('#rqClStatus').textContent=tr('sendError');return}
  await openThread(activeThread);
 });
}
function init(){
 window.rqStartSell=showSell;
 window.rqContactAboutListing=askSeller;
 window.rqOpenMarketInbox=openInbox;
 const existing=window.rqSetSellerLiveListings;
 if(typeof existing==='function'&&!existing.__classifieds){
  const wrapped=rows=>{const x=existing(rows);categoryTiles();return x};
  wrapped.__classifieds=true;window.rqSetSellerLiveListings=wrapped;
 }
 putMarketActions();
 // The classifieds feed is the product's primary landing page; the former
 // multi-service demo home remains accessible through the Home navigation.
 if(!location.hash||location.hash==='#robots')route('robots');
 document.addEventListener('rq:languagechange',()=>{putMarketActions();categoryTiles();const btn=$('#rqMarketInboxBtn');if(btn)btn.textContent=tr('inbox');const hint=$('#rqMarketInfo');if(hint)hint.textContent=tr('priceHint')});
 // Stop legacy handlers from launching the eight-step robot-only wizard.
 document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-action="sell"]');
  if(trigger){e.preventDefault();e.stopImmediatePropagation();showSell();}
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();