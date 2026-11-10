/* RoboQuo private buyer quotations — real listings only, no fake bids, no online payments.
 * Requires database/007_private_offer_visit_workflow.sql and verified RLS.
 */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lang=()=>document.documentElement.lang||'en';
const phrases={
 en:{headline:'Sell with confidence',tagline:'Real photos → compare private offers → on-site inspection → agreed price.',received:'Received offers',sent:'My offers',propose:'Send purchase offer',title:'Private purchase quotation',price:'Your proposed purchase price',pickup:'Collection / transport',collect:'Buyer collects',sellerTransport:'Seller arranges',discuss:'Discuss before visit',note:'Note / conditions',agree:'If the listing matches at the visit, I will not request an additional price reduction.',submit:'Submit private proposal',needLogin:'Please sign in to submit or review quotes.',preview:'Preview is read-only; no offer has been saved.',noListing:'Only real published seller listings accept offers.',saved:'Offer submitted privately to the seller.',noOffers:'No offers yet.',seller:'Received buyer quotations',buyer:'Offers you submitted',select:'Select this offer',schedule:'Schedule on-site visit',visit:'Visit time',inspect:'I inspected the item; it matches the listing',complete:'Record completed off-platform transaction',cancel:'Report mismatch / cancel',reason:'Describe the discrepancy or cancellation reason (at least 6 characters):',failed:'Action not completed. Check sign-in, database setup and listing status.',busy:'Processing…',confirmSelect:'Selecting locks this quoted price. The buyer must inspect the listed item. Continue?',confirmInspect:'Confirm that the product matches the published condition and the pre-agreed price will not be reduced on site?',confirmComplete:'Confirm that payment and handover were completed outside RoboQuo? RoboQuo does not process payments.',status:'Status',readonly:'Product proposals are private to the buyer and seller.',stage_submitted:'Proposed',stage_selected:'Selected',stage_visit_scheduled:'Visit scheduled',stage_inspection_passed:'Buyer inspection passed',stage_completed:'Completed (seller-recorded)',stage_cancelled:'Cancelled',missing:'The quotation database may not have been installed.',paid:'Payments are agreed and completed separately; RoboQuo holds no funds.',close:'Close'},
 ja:{headline:'納得の価格で、安心のロボット売却。',tagline:'実物写真 → 複数見積もり → 現地確認 → 合意価格で取引',received:'届いた見積もり',sent:'提出した見積もり',propose:'買取価格を提案',title:'非公開の買取見積もり',price:'買取希望額',pickup:'引取・輸送条件',collect:'買い手が引取',sellerTransport:'売り手が手配',discuss:'訪問前に相談',note:'条件・備考',agree:'現地で掲載情報と一致した場合、合意価格からの追加値下げ交渉は行いません。',submit:'見積もりを送信',needLogin:'見積もりの送信・確認にはログインしてください。',preview:'プレビューは読み取り専用です。見積もりは保存されません。',noListing:'実際の公開出品のみ見積もりを受け付けます。',saved:'出品者に非公開見積もりを送信しました。',noOffers:'見積もりはまだありません。',seller:'届いた買取見積もり',buyer:'自分が提出した見積もり',select:'この見積もりを選ぶ',schedule:'現地確認日を確定',visit:'訪問予定日時',inspect:'掲載内容と一致することを確認',complete:'取引完了を記録（サイト外決済）',cancel:'相違あり・取引中止',reason:'相違・キャンセル理由を入力してください（6文字以上）：',failed:'処理できませんでした。ログイン・DB設定・出品状態をご確認ください。',busy:'処理中…',confirmSelect:'選択すると見積もり金額が固定されます。現地確認に進みますか？',confirmInspect:'実物が掲載内容と一致し、現地で追加値下げしないことを確認しますか？',confirmComplete:'RoboQuo外で決済と引渡しが完了したことを確認しますか？',status:'状態',readonly:'見積金額は売り手と提案者だけに公開されます。',paid:'RoboQuoには決済・預かり金機能はありません。',close:'閉じる'},
 ko:{headline:'좋은 가격에, 빠르고 안전하게.',tagline:'실제 사진 → 여러 견적 비교 → 현장 확인 → 합의가격 거래',received:'받은 견적',sent:'내가 제안한 견적',propose:'매입 가격 제안',title:'비공개 매입 견적',price:'매입 희망가격',pickup:'인수·운송 조건',collect:'구매자가 직접 인수',sellerTransport:'판매자가 운송 주선',discuss:'방문 전 협의',note:'조건·메모',agree:'현장에서 등록 정보와 제품 상태가 일치하면 합의가격에서 추가 인하를 요구하지 않습니다.',submit:'비공개 견적 보내기',needLogin:'견적 등록과 확인에는 로그인이 필요합니다.',preview:'미리보기에서는 실제 DB 저장이 금지되어 있습니다.',noListing:'공개된 실제 판매 매물에만 견적을 제출할 수 있습니다.',saved:'판매자에게 비공개 매입 견적을 보냈습니다.',noOffers:'아직 도착한 견적이 없습니다.',seller:'받은 매입 견적',buyer:'제출한 매입 견적',select:'이 견적 선택',schedule:'현장 방문 일정 확정',visit:'방문 예정 일시',inspect:'등록 정보와 실제 상태 일치 확인',complete:'외부 결제·인수 완료 기록',cancel:'상태 불일치·거래 취소',reason:'불일치 또는 취소 사유를 입력하세요 (6자 이상):',failed:'처리되지 않았습니다. 로그인·DB 설정·상품 상태를 확인하세요.',busy:'처리 중…',confirmSelect:'제안을 선택하면 해당 매입가격이 고정됩니다. 현장 검수 단계로 진행할까요?',confirmInspect:'상품이 등록 정보와 일치하며 현장에서 추가 가격 인하를 요구하지 않는다는 점을 확인하시겠습니까?',confirmComplete:'RoboQuo 외부에서 결제와 인수가 실제 완료됐습니까?',status:'진행 상태',readonly:'제안 금액은 판매자와 해당 구매자에게만 공개됩니다.',paid:'RoboQuo는 결제나 예치금을 처리하지 않습니다.',close:'닫기'}
};
const t=k=>(phrases[lang()]||phrases.en)[k]||phrases.en[k]||k;
const api=()=>window.rqSupabase||null;
const user=()=>window.rqAuthSession?.user||null;
const protectedWrite=()=>typeof window.rqCanWriteSupabase!=='function'||window.rqCanWriteSupabase()!==false;
const notify=msg=>window.toast?window.toast(msg):window.alert(msg);
const model=r=>[r?.brand||r?.seller_listings?.manufacturer,r?.model||r?.seller_listings?.model].filter(Boolean).join(' ')||'Robot / EOAT';
const money=(number,currency)=>new Intl.NumberFormat(lang()==='ja'?'ja-JP':'en-US',{style:'currency',currency:currency||'JPY',maximumFractionDigits:2}).format(Number(number));
const statusName=s=>t('stage_'+s)==='stage_'+s?s:t('stage_'+s);
const open=content=>{window.openModal?.('<div class="rq-quote-modal">'+content+'</div>');};
function currentListing(id){
 const rows=typeof allRobotListings==='function'?allRobotListings():[];
 return rows.find(row=>String(row.id)===String(id)&&row._source==='seller-supabase'&&row.backendId);
}
function requireLogin(){
 if(user()&&api())return false;
 notify(t('needLogin'));window.rqRequireAuth?.('generic',t('needLogin'));return true;
}
function safeError(error){
 console.warn('RoboQuo private quote',error?.code||'unavailable');
 notify(['PGRST205','42P01','42703'].includes(error?.code)?t('missing'):t('failed'));
}
window.rqOpenBuyerOffer=id=>{
 const item=currentListing(id);
 if(!item||item.sale!=='bid'){notify(t('noListing'));return;}
 if(requireLogin())return;
 if(!protectedWrite()){notify(t('preview'));return;}
 const options='<option value="to_discuss">'+esc(t('discuss'))+'</option><option value="buyer_collects">'+esc(t('collect'))+'</option><option value="seller_arranges">'+esc(t('sellerTransport'))+'</option>';
 open('<h2>'+esc(t('title'))+'</h2><p class="rq-quote-sub">'+esc(model(item))+'</p>'+
 '<p>'+esc(t('readonly'))+'</p><form id="rqOfferForm" class="rq-classifieds-form">'+
 '<label class="rq-cl-field"><span>'+esc(t('price'))+' ('+esc(item.currency||'JPY')+')</span><input type="number" name="amount" step="1" min="1" max="999999999999" required></label>'+
 '<label class="rq-cl-field"><span>'+esc(t('pickup'))+'</span><select name="pickup_terms">'+options+'</select></label>'+
 '<label class="rq-cl-field"><span>'+esc(t('note'))+'</span><textarea name="buyer_note" maxlength="800" rows="3"></textarea></label>'+
 '<label class="rq-cl-consent"><input name="agree" type="checkbox" required><span>'+esc(t('agree'))+'</span></label>'+
 '<p class="rq-quote-note">'+esc(t('paid'))+'</p><p id="rqOfferStatus" role="status" aria-live="polite"></p>'+
 '<div class="rq-cl-actions"><button type="button" class="secondary" id="rqOfferClose">'+esc(t('close'))+'</button><button type="submit" class="primary">'+esc(t('submit'))+'</button></div></form>');
 $('#rqOfferClose')?.addEventListener('click',()=>window.closeModal?.());
 $('#rqOfferForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(requireLogin())return;
  const form=e.currentTarget,button=form.querySelector('button[type="submit"]'),data=new FormData(form),value=Number(data.get('amount'));
  if(!data.get('agree')||!Number.isSafeInteger(value)||value<=0||value>999999999999)return;
  button.disabled=true;
  try{
   // Check the real record; RLS and server trigger also validate all buyer/listing fields.
   const record=await api().from('seller_listings').select('id,owner_id,currency,status,listing_type').eq('id',item.backendId).single();
   if(record.error)throw record.error;
   if(record.data.status!=='published'||record.data.listing_type!=='private_offer')throw Error('Unavailable quote listing');
   if(record.data.owner_id===user().id)throw Error('Seller cannot quote their own listing');
   const saved=await api().from('marketplace_purchase_offers').insert({
    listing_id:record.data.id,seller_id:record.data.owner_id,buyer_id:user().id,
    currency:record.data.currency,amount:value,pickup_terms:String(data.get('pickup_terms')||'to_discuss'),
    buyer_note:String(data.get('buyer_note')||'').trim()
   }).select('id,status').single();
   if(saved.error||saved.data?.status!=='submitted')throw saved.error||Error('Offer not confirmed');
   notify(t('saved'));window.closeModal?.();
  }catch(error){safeError(error);const feedback=$('#rqOfferStatus');if(feedback)feedback.textContent=t('failed');}
  finally{button.disabled=false;}
 });
};
async function renderPanel(role){
 if(requireLogin())return;
 open('<h2>'+esc(role==='seller'?t('seller'):t('buyer'))+'</h2><p>'+esc(t('readonly'))+'</p><p id="rqOfferFeed">'+esc(t('busy'))+'</p>');
 const feed=$('#rqOfferFeed');if(!feed)return;
 try{
  const column=role==='seller'?'seller_id':'buyer_id';
  const result=await api().from('marketplace_purchase_offers')
   .select('id,listing_id,amount,currency,pickup_terms,buyer_note,status,created_at,visit_at,seller_listings(manufacturer,model,status)')
   .eq(column,user().id).order('created_at',{ascending:false}).limit(100);
  if(result.error)throw result.error;
  const rows=result.data||[];
  if(!rows.length){feed.textContent=t('noOffers');return;}
  feed.innerHTML=rows.map(row=>{
   const title=esc([row.seller_listings?.manufacturer,row.seller_listings?.model].filter(Boolean).join(' ')||'Robot / EOAT');
   const state=esc(statusName(row.status));
   const amount=esc(money(row.amount,row.currency));
   const info='<div class="rq-quote-offer-title"><strong>'+title+'</strong><strong>'+amount+'</strong></div>'+
    '<div class="rq-quote-stage">'+esc(t('status'))+': '+state+'</div>'+
    (row.buyer_note?'<p>'+esc(row.buyer_note)+'</p>':'')+
    '<small>'+esc(new Date(row.created_at).toLocaleString())+'</small>';
   let actions='';
   if(role==='seller'&&row.status==='submitted')actions='<button type="button" class="primary" data-rq-quote-action="selected" data-id="'+esc(row.id)+'">'+esc(t('select'))+'</button>';
   if(role==='seller'&&row.status==='selected')actions='<form data-rq-quote-visit="'+esc(row.id)+'"><label>'+esc(t('visit'))+'<input type="datetime-local" name="visit_at" required></label><button class="primary" type="submit">'+esc(t('schedule'))+'</button></form>';
   if(role==='buyer'&&row.status==='visit_scheduled')actions='<button type="button" class="primary" data-rq-quote-action="inspection_passed" data-id="'+esc(row.id)+'">'+esc(t('inspect'))+'</button>';
   if(role==='seller'&&row.status==='inspection_passed')actions='<button type="button" class="primary" data-rq-quote-action="completed" data-id="'+esc(row.id)+'">'+esc(t('complete'))+'</button>';
   if(['selected','visit_scheduled'].includes(row.status))actions+='<button type="button" class="secondary" data-rq-quote-action="cancelled" data-id="'+esc(row.id)+'">'+esc(t('cancel'))+'</button>';
   return '<article class="rq-quote-offer">'+info+'<div class="rq-quote-actions">'+actions+'</div></article>';
  }).join('')+'<p class="rq-quote-note">'+esc(t('paid'))+'</p>';
  feed.querySelectorAll('[data-rq-quote-action]').forEach(button=>button.addEventListener('click',()=>changeStatus(button.dataset.id,button.dataset.rqQuoteAction,role)));
  feed.querySelectorAll('form[data-rq-quote-visit]').forEach(form=>form.addEventListener('submit',e=>{
   e.preventDefault();
   const when=new Date(new FormData(form).get('visit_at'));
   if(!Number.isFinite(when.getTime())||when<=new Date())return;
   changeStatus(form.dataset.rqQuoteVisit,'visit_scheduled',role,{visit_at:when.toISOString()});
  }));
 }catch(error){safeError(error);feed.textContent=t('failed');}
}
async function changeStatus(id,status,role,changes={}){
 if(requireLogin())return;
 if(!protectedWrite()){notify(t('preview'));return;}
 let confirmMessage='';
 if(status==='selected')confirmMessage=t('confirmSelect');
 if(status==='inspection_passed')confirmMessage=t('confirmInspect');
 if(status==='completed')confirmMessage=t('confirmComplete');
 if(confirmMessage&&!window.confirm(confirmMessage))return;
 if(status==='cancelled'){
  const reason=window.prompt(t('reason'),'');
  if(!reason||reason.trim().length<6)return;
  changes.cancel_reason=reason.trim().slice(0,500);
 }
 const before={selected:'submitted',visit_scheduled:'selected',inspection_passed:'visit_scheduled',completed:'inspection_passed'};
 try{
  const query=api().from('marketplace_purchase_offers').update({status,...changes})
   .eq('id',id).eq(role==='seller'?'seller_id':'buyer_id',user().id);
  if(before[status])query.eq('status',before[status]);
  else if(status==='cancelled')query.in('status',['selected','visit_scheduled']);
  const done=await query.select('id,status').single();
  if(done.error||done.data?.status!==status)throw done.error||Error('Status update not confirmed');
  await renderPanel(role);
 }catch(error){safeError(error);}
}
window.rqOpenMyPurchaseOffers=()=>renderPanel('buyer');
window.rqOpenMySaleOffers=()=>renderPanel('seller');
function init(){
 const market=$('#robots .market-toolbar');
 if(!market||$('#rqQuoteShortcuts'))return;
 const el=document.createElement('div');el.id='rqQuoteShortcuts';el.className='wrap rq-quote-shortcuts';
 el.innerHTML='<p class="rq-quote-motto"><strong>'+esc(t('headline'))+'</strong><small>'+esc(t('tagline'))+'</small></p>'+
 '<div class="rq-quote-shortcut-actions"><button type="button" id="rqViewReceived">'+esc(t('received'))+'</button>'+
 '<button type="button" id="rqViewSent">'+esc(t('sent'))+'</button></div>';
 market.insertAdjacentElement('beforebegin',el);
 $('#rqViewReceived').addEventListener('click',window.rqOpenMySaleOffers);
 $('#rqViewSent').addEventListener('click',window.rqOpenMyPurchaseOffers);
 document.addEventListener('rq:languagechange',()=>{
  const h=$('#rqQuoteShortcuts .rq-quote-motto strong'),sub=$('#rqQuoteShortcuts .rq-quote-motto small');
  if(h)h.textContent=t('headline');if(sub)sub.textContent=t('tagline');
  if($('#rqViewReceived'))$('#rqViewReceived').textContent=t('received');
  if($('#rqViewSent'))$('#rqViewSent').textContent=t('sent');
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
