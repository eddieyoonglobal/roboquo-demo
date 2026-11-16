/* RoboQuo Classifieds — real robots and parts, photo-first posting and private messages.
 * Requires database/006_real_classifieds_marketplace.sql. No payment processing.
 * This browser module never contains a Supabase service-role key. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const lang=()=>document.documentElement.lang||'en';
const L={
 en:{market:'Used robots & parts',browse:'Browse actual listings',post:'Sell a robot or part',inbox:'Messages',preview:'Development Preview: publishing to the live database is disabled.',none:'Sign in to send a message or publish a listing.',login:'Sign in',category:'Category',title:'Item title / model',brand:'Brand / manufacturer',condition:'Condition',price:'Asking price (JPY)',location:'Location',description:'Description (included items, defects, history)',images:'Product photos (1–8, max 15 MB each)',name:'Seller name / company',email:'Contact email (private)',phone:'Contact number (private)',declaration:'I own the item or am authorized to sell it and have described its condition accurately.',publish:'Publish listing',publishing:'Publishing...',published:'Your listing is now live.',saveError:'Could not publish. Check the details and database setup.',required:'Fill all required fields and attach at least one supported photo.',close:'Close',contact:'Message seller',offer:'Offer / inquiry',message:'Your message',send:'Send message',sendError:'Message could not be delivered. Verify sign-in and marketplace DB setup.',sent:'Message sent to the seller.',thread:'Conversation',reply:'Reply',emptyInbox:'No conversations yet.',loadError:'Could not load messages. The marketplace database update may not be installed.',priceHint:'Price negotiation only. RoboQuo does not charge or hold payments.',askPrice:'Price inquiry',photosHint:'Actual photos, not stock images',all:'All items'},
 ko:{market:'중고 로봇·부품 거래',browse:'실제 등록 매물 보기',post:'로봇 매각 견적받기',inbox:'내 채팅',preview:'개발 Preview에서는 운영 DB에 매물을 게시할 수 없습니다.',none:'매물 등록과 판매자 채팅에는 로그인이 필요합니다.',login:'로그인',category:'판매 카테고리',title:'상품명 / 모델명',brand:'제조사 / 브랜드',condition:'상품 상태',price:'판매 희망 가격 (엔)',location:'거래 지역',description:'상품 설명 (포함품, 하자, 사용 이력)',images:'실제 상품 사진 (1~8장, 장당 15MB 이내)',name:'판매자 이름 / 상호',email:'연락 이메일 (비공개)',phone:'연락 전화번호 (비공개)',declaration:'본인 소유이거나 판매 권한이 있으며, 상품 상태를 사실대로 기재했습니다.',publish:'상품 게시하기',publishing:'상품 등록 중...',published:'매물이 공개되었습니다.',saveError:'등록에 실패했습니다. 입력 정보와 DB 설정을 확인하세요.',required:'필수 항목과 실제 상품 사진을 확인하세요.',close:'닫기',contact:'판매자에게 채팅',offer:'가격 제안·문의',message:'판매자에게 보낼 메시지',send:'메시지 보내기',sendError:'메시지를 전달하지 못했습니다. 로그인 또는 DB 설정을 확인하세요.',sent:'판매자에게 메시지를 보냈습니다.',thread:'거래 대화',reply:'답장',emptyInbox:'아직 거래 메시지가 없습니다.',loadError:'메시지를 불러오지 못했습니다. 마켓 DB 업데이트가 필요할 수 있습니다.',priceHint:'판매자와 가격을 협의하세요. RoboQuo는 결제나 예치금을 처리하지 않습니다.',askPrice:'가격 문의',photosHint:'판매 상품의 실제 사진을 올려주세요.',all:'전체 상품'},
 ja:{market:'中古ロボット・部品の売買',browse:'実際の出品を見る',post:'ロボット売却見積もり',inbox:'取引メッセージ',preview:'開発プレビューでは、本番データベースへの出品を無効にしています。',none:'出品・メッセージにはログインが必要です。',login:'ログイン',category:'出品カテゴリー',title:'商品名・型番',brand:'メーカー・ブランド',condition:'商品状態',price:'希望価格（円）',location:'所在地・取引地域',description:'商品説明（付属品、不具合、使用履歴）',images:'実物写真（1～8枚、1枚15MB以内）',name:'出品者名・会社名',email:'連絡先メール（非公開）',phone:'連絡先電話（非公開）',declaration:'所有者または販売権限があり、商品の状態を正確に記載しました。',publish:'出品を公開する',publishing:'公開中…',published:'商品が公開されました。',saveError:'出品できませんでした。入力内容とDB設定をご確認ください。',required:'必須項目と実物写真をご確認ください。',close:'閉じる',contact:'出品者にメッセージ',offer:'価格交渉・お問い合わせ',message:'出品者へのメッセージ',send:'メッセージを送る',sendError:'メッセージを送信できませんでした。ログインまたはDB設定をご確認ください。',sent:'出品者にメッセージを送信しました。',thread:'取引メッセージ',reply:'返信',emptyInbox:'メッセージはまだありません。',loadError:'メッセージを表示できません。DBの更新が必要な可能性があります。',priceHint:'支払いは当事者間で確認してください。RoboQuoは決済・預かり金に対応していません。',askPrice:'価格のお問い合わせ',photosHint:'ストック画像ではなく実物写真をご登録ください。',all:'すべての商品'}
};
const QUOTE_TEXT={
 en:{sellMode:'How do you want to sell?',compare:'Get offers from multiple buyers',fixed:'Sell at a fixed price',hint:'Buyer proposals are private. Choose one, schedule an inspection and settle at the agreed price if the item matches. No on-site renegotiation.'},
 ja:{sellMode:'売却方法',compare:'複数の買取業者から見積もりを受け取る',fixed:'定額で出品する',hint:'買い手の提案は非公開です。売却価格を選び、現地確認で掲載情報と一致すれば再交渉せず合意価格で取引します。'},
 ko:{sellMode:'어떻게 판매할까요?',compare:'여러 매입업체의 견적받기',fixed:'정해진 가격으로 판매',hint:'구매 제안은 비공개입니다. 제안을 선택하고 현장에서 등록 정보와 일치하면 합의한 가격으로 거래합니다. 현장 추가 네고는 하지 않습니다.'}
};
function qt(key){const l=QUOTE_TEXT[lang()]||QUOTE_TEXT.en;return l[key]||QUOTE_TEXT.en[key]||key;}
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
// Guided first-listing preset. Not an existing offer: never inserts or publishes automatically.
const YASKAWA_FIRST_LISTING={
 maker:'YASKAWA',model:'CSRA-SDB06HA',category:'part',phone:'010-3975-7017',
 descriptions:{
  ko:'YASKAWA SERVOPACK CSRA-SDB06HA. 사진에 보이는 본체와 상자입니다.\n작동 여부, 사용 이력, 구성품, 하자 및 보증 여부는 판매자 확인 후 안내합니다.\n구입 문의: 010-3975-7017',
  ja:'YASKAWA SERVOPACK CSRA-SDB06HA。写真に写っている本体と箱です。\n動作確認、使用履歴、付属品、瑕疵および保証の有無は出品者にご確認ください。\n購入のお問い合わせ：010-3975-7017',
  en:'YASKAWA SERVOPACK CSRA-SDB06HA. Main unit and box shown in the actual photos.\nOperation, usage history, included accessories, defects and warranty are not yet confirmed by the seller.\nPurchase inquiries: 010-3975-7017'
 }
};
const YASKAWA_GUIDE={
 ko:{caption:'첫 상품 등록 준비 · 실제 게시 전 확인이 필요합니다.',tip:'사진 6장을 선택하고 판매 국가·상품 상태·거래 지역·판매자 정보를 직접 확인하세요. 가격은 협의로 진행하려면 비워둘 수 있습니다. 등록 버튼을 누르기 전에는 공개되지 않습니다.',choose:'선택해주세요'},
 ja:{caption:'初回出品の入力補助・公開前に内容をご確認ください。',tip:'写真6枚を選択し、出品国・商品状態・所在地・出品者情報を確認してください。価格交渉の場合、希望価格は空欄のままでも構いません。公開ボタンを押すまで出品されません。',choose:'選択してください'},
 en:{caption:'First listing preset · verify details before publishing.',tip:'Select all 6 actual photos, then choose seller country, condition, location and seller details. Leave price empty for negotiable offers. Nothing is public until you submit.',choose:'Please select'}
};
const MARKET_WORDS={
 ko:{country:'판매 국가',currency:'가격 통화',sellerType:'판매자',sellerIndividual:'개인',sellerBusiness:'업체·대리점',conditionAll:'전체 상태',countryAll:'전체 국가',itemStatus:'상품 상태',allItems:'전체 상품'},
 ja:{country:'出品国',currency:'通貨',sellerType:'出品者',sellerIndividual:'個人',sellerBusiness:'販売店・企業',conditionAll:'すべての状態',countryAll:'すべての国',itemStatus:'商品状態',allItems:'すべての商品'},
 en:{country:'Seller country',currency:'Currency',sellerType:'Seller',sellerIndividual:'Individual',sellerBusiness:'Company / dealer',conditionAll:'All conditions',countryAll:'All countries',itemStatus:'Condition',allItems:'All items'}
};
Object.assign(C,{"zh":{"robot":"机器人本体","gripper":"夹爪与EOAT","controller":"控制器","vision":"视觉与传感器","part":"机器人配件","accessory":"外围设备","other":"其他"},"de":{"robot":"Roboter","gripper":"Greifer / EOAT","controller":"Steuerung","vision":"Bildverarbeitung / Sensor","part":"Roboterteil","accessory":"Zubehör","other":"Sonstiges"},"fr":{"robot":"Robot","gripper":"Préhenseur / EOAT","controller":"Contrôleur","vision":"Vision / capteur","part":"Pièce robot","accessory":"Accessoire","other":"Autre"},"es":{"robot":"Robot","gripper":"Pinza / EOAT","controller":"Controlador","vision":"Visión / sensor","part":"Pieza de robot","accessory":"Accesorio","other":"Otros"},"it":{"robot":"Robot","gripper":"Pinza / EOAT","controller":"Controller","vision":"Visione / sensore","part":"Ricambio robot","accessory":"Accessori","other":"Altro"},"pt":{"robot":"Robô","gripper":"Garra / EOAT","controller":"Controlador","vision":"Visão / sensor","part":"Peça de robô","accessory":"Acessórios","other":"Outros"},"vi":{"robot":"Robot","gripper":"Kẹp / EOAT","controller":"Bộ điều khiển","vision":"Thị giác / cảm biến","part":"Phụ tùng robot","accessory":"Thiết bị ngoại vi","other":"Khác"}});
Object.assign(CONDITIONS,{"zh":{"used":"二手","new":"全新","refurbished":"翻新","for_parts":"拆件 / 故障"},"de":{"used":"Gebraucht","new":"Neu","refurbished":"Überholt","for_parts":"Ersatzteile / Defekt"},"fr":{"used":"Occasion","new":"Neuf","refurbished":"Reconditionné","for_parts":"Pièces / Défectueux"},"es":{"used":"Usado","new":"Nuevo","refurbished":"Reacondicionado","for_parts":"Para piezas / Averiado"},"it":{"used":"Usato","new":"Nuovo","refurbished":"Ricondizionato","for_parts":"Per ricambi / Guasto"},"pt":{"used":"Usado","new":"Novo","refurbished":"Recondicionado","for_parts":"Para peças / Com defeito"},"vi":{"used":"Đã qua sử dụng","new":"Mới","refurbished":"Tân trang","for_parts":"Lấy linh kiện / Hỏng"}});
Object.assign(MARKET_WORDS,{"zh":{"country":"卖家所在国家","currency":"货币","sellerType":"卖家","sellerIndividual":"个人","sellerBusiness":"企业 / 经销商","conditionAll":"全部状态","countryAll":"所有国家","itemStatus":"商品状态","allItems":"全部商品"},"de":{"country":"Land","currency":"Währung","sellerType":"Anbieter","sellerIndividual":"Privat","sellerBusiness":"Firma / Händler","conditionAll":"Alle Zustände","countryAll":"Alle Länder","itemStatus":"Artikelzustand","allItems":"Alle Artikel"},"fr":{"country":"Pays","currency":"Devise","sellerType":"Vendeur","sellerIndividual":"Particulier","sellerBusiness":"Entreprise / Revendeur","conditionAll":"Tous états","countryAll":"Tous pays","itemStatus":"État de l'article","allItems":"Tous les articles"},"es":{"country":"País","currency":"Moneda","sellerType":"Vendedor","sellerIndividual":"Particular","sellerBusiness":"Empresa / Distribuidor","conditionAll":"Todos los estados","countryAll":"Todos los países","itemStatus":"Estado del artículo","allItems":"Todos los artículos"},"it":{"country":"Paese","currency":"Valuta","sellerType":"Venditore","sellerIndividual":"Privato","sellerBusiness":"Azienda / Rivenditore","conditionAll":"Tutte le condizioni","countryAll":"Tutti i paesi","itemStatus":"Condizione","allItems":"Tutti gli articoli"},"pt":{"country":"País","currency":"Moeda","sellerType":"Vendedor","sellerIndividual":"Particular","sellerBusiness":"Empresa / Revendedor","conditionAll":"Todas condições","countryAll":"Todos os países","itemStatus":"Condição","allItems":"Todos os itens"},"vi":{"country":"Quốc gia","currency":"Tiền tệ","sellerType":"Người bán","sellerIndividual":"Cá nhân","sellerBusiness":"Công ty / Đại lý","conditionAll":"Mọi tình trạng","countryAll":"Tất cả quốc gia","itemStatus":"Tình trạng","allItems":"Tất cả sản phẩm"}});
// Apply translated filter copy after all ten locale dictionaries have been added.
 // Other seller-form labels intentionally fall back to English until translated.
 Object.entries(MARKET_WORDS).forEach(([code,words])=>Object.assign(L[code]||(L[code]={}),words));
 const COUNTRIES={Japan:{ko:'일본',ja:'日本',en:'Japan'},Korea:{ko:'한국',ja:'韓国',en:'Korea'},China:{ko:'중국',ja:'中国',en:'China'},Taiwan:{ko:'대만',ja:'台湾',en:'Taiwan'},USA:{ko:'미국',ja:'米国',en:'USA'},Germany:{ko:'독일',ja:'ドイツ',en:'Germany'},Other:{ko:'기타 국가',ja:'その他',en:'Other'}};
// Localized country option names for every supported marketplace language.
Object.entries({"Japan":{"zh":"日本","de":"Japan","fr":"Japon","es":"Japón","it":"Giappone","pt":"Japão","vi":"Nhật Bản"},"Korea":{"zh":"韩国","de":"Südkorea","fr":"Corée du Sud","es":"Corea del Sur","it":"Corea del Sud","pt":"Coreia do Sul","vi":"Hàn Quốc"},"China":{"zh":"中国","de":"China","fr":"Chine","es":"China","it":"Cina","pt":"China","vi":"Trung Quốc"},"Taiwan":{"zh":"台湾","de":"Taiwan","fr":"Taïwan","es":"Taiwán","it":"Taiwan","pt":"Taiwan","vi":"Đài Loan"},"USA":{"zh":"美国","de":"USA","fr":"États-Unis","es":"EE. UU.","it":"Stati Uniti","pt":"EUA","vi":"Hoa Kỳ"},"Germany":{"zh":"德国","de":"Deutschland","fr":"Allemagne","es":"Alemania","it":"Germania","pt":"Alemanha","vi":"Đức"},"Other":{"zh":"其他","de":"Sonstige","fr":"Autre","es":"Otro","it":"Altro","pt":"Outros","vi":"Khác"}}).forEach(([country,labels])=>Object.assign(COUNTRIES[country],labels));
const countryName=key=>COUNTRIES[key]?.[lang()]||COUNTRIES[key]?.en||key;
const currForCountry={Japan:'JPY',Korea:'KRW',China:'CNY',Taiwan:'USD',USA:'USD',Germany:'EUR',Other:'USD'};
const CURRENCIES={JPY:'¥ JPY',KRW:'₩ KRW',CNY:'CN¥ CNY',USD:'$ USD',EUR:'€ EUR'};
const SELL_UI={
 ko:{manufacturerSearch:'제조사 검색',manufacturerSelect:'제조사 선택',manufacturerOther:'기타 — 제조사 직접 입력',manufacturerOtherHint:'등록된 제조사가 없으면 제조사명을 직접 입력하세요.',manufacturerOtherPlaceholder:'제조사명을 입력하세요',manufacturerLoading:'제조사 목록을 불러오는 중…',manufacturerCount:n=>'제조사 '+n+'곳',manufacturerNone:'일치하는 제조사가 없습니다. 기타를 선택해 직접 입력하세요.',price:'판매 희망 가격',fixedPrice:'판매 가격',optional:'선택',priceHelp:'가격 협의는 비워둘 수 있습니다. 통화만 바뀌며 금액은 자동 환산하지 않습니다.',priceRequired:'정가 판매는 실제 판매 가격을 입력해야 합니다.',priceChanged:'통화가 바뀌어 기존 가격을 지웠습니다. 새 통화 기준으로 다시 입력하세요.',pricePlaceholder:'가격 입력 또는 공란 유지',makerRequired:'제조사를 선택하거나 기타에서 직접 입력하세요.',invalidPrice:'금액은 0보다 큰 숫자로 입력하거나, 가격 협의 방식에서는 공란으로 두세요.'},
 ja:{manufacturerSearch:'メーカーを検索',manufacturerSelect:'メーカーを選択',manufacturerOther:'その他・メーカー名を入力',manufacturerOtherHint:'一覧にないメーカーは直接入力してください。',manufacturerOtherPlaceholder:'メーカー名',manufacturerLoading:'メーカー一覧を読み込み中…',manufacturerCount:n=>'メーカー '+n+' 社',manufacturerNone:'該当なし。その他から直接入力できます。',price:'希望販売価格',fixedPrice:'販売価格',optional:'任意',priceHelp:'価格交渉の場合は空欄にできます。通貨の変更時に金額の換算は行いません。',priceRequired:'定額販売には販売価格の入力が必要です。',priceChanged:'通貨が変更されたため、旧金額を消去しました。新しい通貨で入力してください。',pricePlaceholder:'金額を入力、または空欄',makerRequired:'メーカーを選択するか、その他を選んで入力してください。',invalidPrice:'0より大きい金額を入力してください。価格交渉なら空欄にできます。'},
 en:{manufacturerSearch:'Search manufacturers',manufacturerSelect:'Select manufacturer',manufacturerOther:'Other — enter a manufacturer',manufacturerOtherHint:'If the maker is missing, select Other and enter its real name.',manufacturerOtherPlaceholder:'Enter manufacturer name',manufacturerLoading:'Loading all manufacturers…',manufacturerCount:n=>n+' manufacturers',manufacturerNone:'No matches. Choose Other to enter it manually.',price:'Asking price',fixedPrice:'Fixed selling price',optional:'optional',priceHelp:'Leave blank for private offers. Currency changes never convert numbers.',priceRequired:'Fixed-price listings require a selling price.',priceChanged:'Currency changed; the old amount was cleared. Enter a price in the new currency.',pricePlaceholder:'Enter amount or leave blank',makerRequired:'Select a manufacturer or enter its name under Other.',invalidPrice:'Enter a number greater than zero, or leave blank for private offers.'}
};
const sellUi=()=>SELL_UI[lang()]||SELL_UI.en;
const MAKER_FALLBACK=['ABB Robotics','FANUC','KUKA','Mitsubishi Electric','Nachi-Fujikoshi','OMRON Robotics','OnRobot','SMC','Universal Robots','YASKAWA'];
const makerValue=name=>name==='Yaskawa Electric'?'YASKAWA':name;
function makeBrandChoices(form,firstProduct){
 const selector=form.querySelector('#rqClMakerSelect'),search=form.querySelector('#rqClMakerSearch');
 const other=form.querySelector('#rqClMakerOther'),count=form.querySelector('#rqClMakerCount');
 const u=sellUi();
 let catalog=[...MAKER_FALLBACK],chosen=firstProduct?'YASKAWA':'';
 function renderOptions(){
   const term=String(search.value||'').trim().toLocaleLowerCase();
   const options=catalog.filter(name=>name.toLocaleLowerCase().includes(term));
   selector.replaceChildren();
   const prompt=document.createElement('option');prompt.value='';prompt.textContent=u.manufacturerSelect;prompt.disabled=true;selector.append(prompt);
   for(const name of options){
     const option=document.createElement('option');option.value=name;option.textContent=name;selector.append(option);
   }
   const custom=document.createElement('option');custom.value='__other__';custom.textContent=u.manufacturerOther;selector.append(custom);
   // Preserve a selected maker while searching for another.
   if(chosen&&!options.includes(chosen)&&chosen!=='__other__'){
     const kept=document.createElement('option');kept.value=chosen;kept.textContent=chosen;selector.insertBefore(kept,selector.children[1]);
   }
   selector.value=chosen||'';
   if(selector.selectedIndex<0)selector.selectedIndex=0;
   count.textContent=u.manufacturerCount(catalog.length)+(term&&!options.length?' · '+u.manufacturerNone:'');
 }
 function onSelect(){
   chosen=selector.value;
   const custom=chosen==='__other__';
   other.hidden=!custom;other.disabled=!custom;other.required=custom;
   if(custom)other.focus();
 }
 search.setAttribute('aria-label',u.manufacturerSearch);
 search.placeholder=u.manufacturerSearch;
 other.placeholder=u.manufacturerOtherPlaceholder;
 other.setAttribute('aria-label',u.manufacturerOtherHint);
 selector.addEventListener('change',onSelect);
 search.addEventListener('input',renderOptions);
 renderOptions();onSelect();
 fetch('./seller-manufacturers.json?v=20261116',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw Error('Maker directory HTTP '+r.status);return r.json();})
 .then(data=>{
   if(!Array.isArray(data.names)||data.names.length<150)throw Error('Maker directory incomplete');
   const expanded=data.names.map(makerValue);
   catalog=[...new Set([...expanded,...MAKER_FALLBACK])].sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
   renderOptions();onSelect();
 }).catch(e=>{count.textContent=u.manufacturerCount(catalog.length)+' · '+u.manufacturerOtherHint;console.warn('RoboQuo maker directory unavailable',e.message)});
}
function enhanceSaleCurrency(form){
 // The seller-country choice is the only currency source in this simple posting flow.
 // Avoid a separately editable currency select that can contradict the country.
 const country=form.querySelector('#rqClCountry');
 const currency=form.querySelector('#rqClCurrency'); // hidden input, included in FormData
 const display=form.querySelector('#rqClCurrencyDisplay');
 const price=form.querySelector('[name="price"]');
 const label=form.querySelector('#rqClPriceLabel');
 const help=form.querySelector('#rqClPriceHelp');
 const mode=form.querySelector('#rqClSellMethod');
 const u=sellUi();
 function repaint(warning=false){
   const fixed=mode.value==='fixed';
   const unit=currency.value||'JPY';
   const amountUnit=CURRENCIES[unit]||unit;
   label.textContent=(fixed?u.fixedPrice:u.price)+' ('+amountUnit+')'+(fixed?' *':' · '+u.optional);
   display.textContent=amountUnit;
   price.required=fixed;
   price.placeholder=u.pricePlaceholder;
   help.textContent=warning?u.priceChanged:(fixed?u.priceRequired+' ':'')+u.priceHelp;
 }
 function syncFromCountry(){
   const chosen=country.value;
   if(!chosen){repaint();return;}
   const next=currForCountry[chosen]||'USD';
   const changed=currency.value!==next;
   const cleared=changed&&price.value.trim()!=='';
   if(cleared)price.value='';
   currency.value=next;
   repaint(cleared);
 }
 country.addEventListener('change',syncFromCountry);
 mode.addEventListener('change',()=>repaint());
 // On every opening, recover even if old code left a mismatched country/currency.
 syncFromCountry();
 // Block accidental/malformed FormData currency values from inconsistent seller UI.
 form.addEventListener('submit',()=>syncFromCountry(),{capture:true});
}
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
 const active=$('#categoryFilter')?.value||'';
 container.innerHTML='<button type="button" data-filter="" class="'+(!active?'active':'')+'">'+esc(tr('all'))+'</button>'+
   Object.keys(C.en).map(k=>'<button type="button" data-filter="'+k+'" class="'+(active===k?'active':'')+'">'+esc(cat(k))+'</button>').join('');
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
function patchMarketFilters(){
 const country=$('#countryFilter');
 if(country){
  const current=country.value;
  country.innerHTML='<option value="">'+esc(tr('countryAll'))+'</option>'+
   Object.keys(COUNTRIES).map(code=>'<option value="'+code+'">'+esc(countryName(code))+'</option>').join('');
  if(Object.keys(COUNTRIES).includes(current))country.value=current;
  country.setAttribute('aria-label',tr('country'));
 }
 const condition=$('#conditionFilter');
 if(condition){
  const current=condition.value;
  condition.innerHTML='<option value="">'+esc(tr('conditionAll'))+'</option>'+
    Object.entries(CONDITIONS[lang()]||CONDITIONS.en).map(([code,text])=>
     '<option value="'+code+'">'+esc(text)+'</option>').join('');
  if(Object.keys(CONDITIONS.en).includes(current))condition.value=current;
  condition.setAttribute('aria-label',tr('itemStatus'));
 }
}
const MARKET_FIRST_ACTIONS={
 ko:{buy:'상품 찾기',buyHint:'로봇·그리퍼·부품 둘러보기',sell:'상품 팔기',sellHint:'사진 올리고 가격 입력'},
 ja:{buy:'商品を探す',buyHint:'ロボット・グリッパー・部品',sell:'商品を売る',sellHint:'写真を選んで価格を入力'},
 en:{buy:'Find an item',buyHint:'Robots, grippers and parts',sell:'Sell an item',sellHint:'Add photos and your price'},
 zh:{"buy":"查找商品","buyHint":"机器人、夹爪与配件","sell":"发布商品","sellHint":"上传实物照片及价格"},
 de:{"buy":"Artikel finden","buyHint":"Roboter, Greifer und Teile","sell":"Artikel verkaufen","sellHint":"Fotos und Preis hinzufügen"},
 fr:{"buy":"Trouver un article","buyHint":"Robots, préhenseurs et pièces","sell":"Vendre un article","sellHint":"Ajouter photos et prix"},
 es:{"buy":"Buscar un artículo","buyHint":"Robots, pinzas y piezas","sell":"Vender un artículo","sellHint":"Añadir fotos y precio"},
 it:{"buy":"Cerca un articolo","buyHint":"Robot, pinze e ricambi","sell":"Vendi un articolo","sellHint":"Aggiungi foto e prezzo"},
 pt:{"buy":"Encontrar item","buyHint":"Robôs, garras e peças","sell":"Vender item","sellHint":"Adicione fotos e preço"},
 vi:{"buy":"Tìm sản phẩm","buyHint":"Robot, kẹp và phụ tùng","sell":"Đăng bán","sellHint":"Thêm ảnh và giá"}
};
function updateFirstActions(){
 const copy=MARKET_FIRST_ACTIONS[lang()]||MARKET_FIRST_ACTIONS.en;
 const buy=$('#rqBrowseShortcut'),sell=$('#rqSellShortcut');
 if(buy){buy.querySelector('strong').textContent=copy.buy;buy.querySelector('small').textContent=copy.buyHint}
 if(sell){sell.querySelector('strong').textContent=copy.sell;sell.querySelector('small').textContent=copy.sellHint}
 const search=$('#marketSearch');
 if(search){const placeholders={ko:'상품명·브랜드 검색',ja:'商品名・メーカーを検索',zh:'搜索商品或品牌',de:'Artikel oder Marke suchen',fr:'Rechercher un article ou une marque',es:'Buscar artículo o marca',it:'Cerca articolo o marchio',pt:'Pesquisar item ou marca',vi:'Tìm sản phẩm hoặc thương hiệu'};search.placeholder=placeholders[lang()]||'Search item or brand';}
}
// Buyer feedback is based only on actual seller listings passed by v24.js.
let marketCounts={visible:0,total:0};
function updateMarketFeedback(visible=marketCounts.visible,total=marketCounts.total){
 marketCounts={visible:Number(visible)||0,total:Number(total)||0};
 const count=$('#rqMarketResultCount'),clear=$('#rqMarketReset');
 const v=marketCounts.visible,t=marketCounts.total;
 const messages={
  en:`Showing ${v} of ${t} listings`,ja:`全${t}件中${v}件を表示`,ko:`전체 ${t}건 중 ${v}건 표시`,
  zh:`显示 ${v} / ${t} 条商品`,de:`${v} von ${t} Angeboten`,fr:`${v} annonces sur ${t}`,
  es:`${v} de ${t} anuncios`,it:`${v} annunci su ${t}`,pt:`${v} de ${t} anúncios`,vi:`Hiển thị ${v} / ${t} tin đăng`
 };
 const clearCopy={en:'Clear filters',ja:'絞り込みを解除',ko:'필터 초기화',zh:'清除筛选',de:'Filter löschen',
  fr:'Effacer les filtres',es:'Borrar filtros',it:'Azzera filtri',pt:'Limpar filtros',vi:'Xóa bộ lọc'};
 if(count)count.textContent=messages[lang()]||messages.en;
 if(clear){
  clear.textContent=clearCopy[lang()]||clearCopy.en;
  clear.hidden=!['marketSearch','categoryFilter','countryFilter','conditionFilter'].some(id=>String(document.getElementById(id)?.value||'').trim());
 }
}
function installMarketFeedback(){
 let row=$('#rqMarketFeedback');
 if(!row){
  const toolbar=$('#rqMarketSearchArea');if(!toolbar)return;
  row=document.createElement('div');row.id='rqMarketFeedback';row.className='wrap rq-market-feedback';
  row.innerHTML='<span id="rqMarketResultCount" role="status" aria-live="polite"></span><button type="button" id="rqMarketReset" class="rq-market-reset" hidden></button>';
  toolbar.insertAdjacentElement('afterend',row);
  $('#rqMarketReset').addEventListener('click',()=>{
   for(const id of ['marketSearch','categoryFilter','countryFilter','conditionFilter']){
    const field=document.getElementById(id);if(field)field.value='';
   }
   if(typeof window.rqRenderMarketplace==='function')window.rqRenderMarketplace();
   else $('#marketSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
   categoryTiles();
   updateMarketFeedback();
  });
 }
 const cardCount=$('#marketListings')?.querySelectorAll('.v24-listing-card').length||0;
 if(marketCounts.total===0&&cardCount>0)marketCounts={visible:cardCount,total:cardCount};
 updateMarketFeedback();
}
function putMarketActions(){
 updateFirstActions();
 const buy=$('#rqBrowseShortcut'),sell=$('#rqSellShortcut');
 if(buy&&!buy.dataset.marketBound){
  buy.dataset.marketBound='1';
  buy.addEventListener('click',()=>{
   const search=$('#marketSearch');
   search?.focus();
   search?.scrollIntoView({behavior:'smooth',block:'center'});
  });
 }
 if(sell&&!sell.dataset.marketBound){
  sell.dataset.marketBound='1';
  sell.addEventListener('click',()=>showSell());
 }
 if(!$('#rqMarketInfo')){
  const list=$('#marketListings');
  if(list){
   const p=document.createElement('p');
   p.id='rqMarketInfo';p.className='rq-market-subtitle';
   p.textContent=tr('priceHint');
   list.insertAdjacentElement('afterend',p);
  }
 }
 categoryTiles();
 patchMarketFilters();
 installMarketFeedback();
}
function showSell(initialCat,presetId){
 files=[];
 const firstProduct=presetId==='yaskawa-csra-sdb06ha';
 const guide=YASKAWA_GUIDE[lang()]||YASKAWA_GUIDE.en;
 const account=user();
 const meta=account?.user_metadata||{};
 const initial=firstProduct?'part':initialCat&&C.en[initialCat]?initialCat:'robot';
 const firstDescription=YASKAWA_FIRST_LISTING.descriptions[lang()]||YASKAWA_FIRST_LISTING.descriptions.en;
 const requiredOption=firstProduct?'<option value="" selected disabled>'+esc(guide.choose)+'</option>':'';
 const html=[
 '<div class="rq-cl-head"><h2>'+esc(tr('post'))+'</h2><p>'+esc(firstProduct?guide.caption:tr('photosHint'))+'</p></div>',
 firstProduct?'<p class="rq-cl-sale-note" role="status">'+esc(guide.tip)+'</p>':'',
 '<form id="rqQuickSellForm" class="rq-classifieds-form">',
 '<label class="rq-cl-field rq-cl-method"><span>'+esc(qt('sellMode'))+'</span><select name="sellMethod" id="rqClSellMethod" required><option value="quotes">'+esc(qt('compare'))+'</option><option value="fixed">'+esc(qt('fixed'))+'</option></select></label>',
 '<p class="rq-cl-sale-note">'+esc(qt('hint'))+'</p>',
 '<div class="rq-cl-pictures"><label>'+esc(tr('images'))+' *<input id="rqClPhotos" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" required></label><div id="rqClPreview" class="rq-cl-pictures-grid"></div></div>',
 '<div class="rq-cl-columns">',
 '<label class="rq-cl-field"><span>'+esc(tr('category'))+' *</span><select name="itemCategory" required>'+choices(C[lang()]||C.en,initial)+'</select></label>',
 '<label class="rq-cl-field"><span>'+esc(tr('condition'))+' *</span><select name="itemCondition" required>'+requiredOption+choices(CONDITIONS[lang()]||CONDITIONS.en,firstProduct?'':'used')+'</select></label>',
 '<label class="rq-cl-field"><span>'+esc(tr('country'))+' *</span><select name="country" id="rqClCountry" required>'+requiredOption+choices(Object.fromEntries(Object.keys(COUNTRIES).map(k=>[k,countryName(k)])),firstProduct?'':'Japan')+'</select></label>',
 '<label class="rq-cl-field"><span>'+esc(tr('currency'))+'</span><span id="rqClCurrencyDisplay" class="rq-cl-currency-display" role="status" aria-live="polite">'+esc(CURRENCIES.JPY)+'</span><input name="currency" id="rqClCurrency" type="hidden" value="JPY"></label>',
 field(tr('title'),'model',{required:true,placeholder:'FANUC CRX-10iA / RG2 / R-30iB',value:firstProduct?YASKAWA_FIRST_LISTING.model:''}),
 '<label class="rq-cl-field"><span>'+esc(tr('brand'))+' *</span><input id="rqClMakerSearch" type="search" autocomplete="off" aria-label="'+esc(sellUi().manufacturerSearch)+'" placeholder="'+esc(sellUi().manufacturerSearch)+'"><select name="maker" id="rqClMakerSelect" required aria-label="'+esc(sellUi().manufacturerSelect)+'"><option value="" disabled selected>'+esc(sellUi().manufacturerLoading)+'</option></select><small id="rqClMakerCount" aria-live="polite"></small><input type="text" name="makerOther" id="rqClMakerOther" maxlength="120" placeholder="'+esc(sellUi().manufacturerOtherPlaceholder)+'" hidden disabled></label>',
 '<label class="rq-cl-field"><span id="rqClPriceLabel">'+esc(sellUi().price)+'</span><input type="number" name="price" min="0" step="any" inputmode="decimal" placeholder="'+esc(sellUi().pricePlaceholder)+'"><small id="rqClPriceHelp" role="status" aria-live="polite"></small></label>',
 field(tr('location'),'location',{required:true,placeholder:'Tokyo / Osaka'}),
 '</div>',
 '<label class="rq-cl-field"><span>'+esc(tr('description'))+' *</span><textarea name="description" required rows="4" maxlength="5000">'+esc(firstProduct?firstDescription:'')+'</textarea></label>',
 '<div class="rq-cl-columns">',
 '<label class="rq-cl-field"><span>'+esc(tr('sellerType'))+' *</span><select name="sellerType" required>'+choices({individual:tr('sellerIndividual'),business:tr('sellerBusiness')},'individual')+'</select></label>',
 field(tr('name'),'companyName',{required:true,value:meta.company_name||meta.display_name||''}),
 field(tr('email'),'contactEmail',{required:true,type:'email',value:account?.email||''}),
 field(tr('phone'),'contactPhone',{required:true,type:'tel',value:firstProduct?YASKAWA_FIRST_LISTING.phone:(meta.phone||'')}),
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
 makeBrandChoices(form,firstProduct);
 enhanceSaleCurrency(form);
 $('#rqClPhotos')?.addEventListener('change',e=>{
  files=[...(e.target.files||[])];
  const previews=$('#rqClPreview');previews.replaceChildren();
  files.slice(0,8).forEach(file=>{
   const img=document.createElement('img');img.alt=file.name;img.src=URL.createObjectURL(file);
   img.onload=()=>URL.revokeObjectURL(img.src);previews.appendChild(img);
  });
 });
 if(firstProduct){form.dataset.firstProduct='yaskawa-csra-sdb06ha';form.querySelector('[name="sellMethod"]').value='quotes';}
 form.addEventListener('submit',submitListing);
}
async function submitListing(event){
 event.preventDefault();if(busy)return;
 const form=event.currentTarget,status=$('#rqClStatus'),btn=$('#rqClSubmit');
 const data=Object.fromEntries(new FormData(form).entries());
 // A mismatch is never silently published; posting uses the currency of the seller's country.
 if(data.country && data.currency!==(currForCountry[data.country]||'USD')){
   status.textContent=sellUi().priceChanged;return;
 }
 data.maker=data.maker==='__other__'?String(data.makerOther||'').trim():String(data.maker||'').trim();
 if(!data.maker){status.textContent=sellUi().makerRequired;return;}
 if(data.price.trim() && (!Number.isFinite(Number(data.price))||Number(data.price)<=0)){
  status.textContent=sellUi().invalidPrice;return;
 }
 if(data.sellMethod==='fixed'&&(!data.price.trim()||Number(data.price)<=0)){
  status.textContent=sellUi().priceRequired;return;
 }
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
  const draft={...data,contactName:data.companyName,sale:data.sellMethod==='fixed'?'fixed':'bid',working:'unknown',declared:true};
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
 window.rqMarketResultsChanged=updateMarketFeedback;
 window.rqStartSell=showSell;
 window.rqStartFirstProduct=()=>showSell('part','yaskawa-csra-sdb06ha');
 window.rqContactAboutListing=askSeller;
 window.rqOpenMarketInbox=openInbox;
 const existing=window.rqSetSellerLiveListings;
 if(typeof existing==='function'&&!existing.__classifieds){
  const wrapped=rows=>{const x=existing(rows);categoryTiles();return x};
  wrapped.__classifieds=true;window.rqSetSellerLiveListings=wrapped;
 }
 putMarketActions();
 // The marketplace is the first page for new visitors, matching the
 // active section in index.html before JavaScript loads. Deep links remain usable.
 const requested=location.hash.slice(1);
 const pageId=requested&&document.getElementById(requested)?.classList.contains('page')
   ?requested:'robots';
 route(pageId);
 // Reveal the prepared page only after v24 and marketplace setup have run.
 requestAnimationFrame(()=>document.documentElement.classList.remove('rq-first-paint'));
 // Opt-in owner preview link; this prefills a form only. It never writes to the live DB.
 if(new URLSearchParams(location.search).get('firstProduct')==='yaskawa-csra-sdb06ha'){
   setTimeout(()=>window.rqStartFirstProduct?.(),550);
 }
 document.addEventListener('rq:languagechange',()=>{
  putMarketActions();
  const hint=$('#rqMarketInfo');if(hint)hint.textContent=tr('priceHint');
});
 // Stop legacy handlers from launching the eight-step robot-only wizard.
 document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-action="sell"]');
  if(trigger){e.preventDefault();e.stopImmediatePropagation();showSell();}
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();