/* RoboQuo visual-first navigation and localized artwork labels.
 * Static UI only. No Supabase, account, upload or payment writes.
 * Images are original illustrations except for the separately attributed CC BY 2.0 robot photo.
 */
(function(){
 'use strict';
 const copy={"en":{"title":"See it. Find it.","sub":"Choose the kind of equipment, then browse actual listings.","robot":"Robots","robotSub":"Industrial and collaborative robots","gripper":"Grippers & EOAT","gripperSub":"Grippers, vacuum and robot tooling","part":"Parts & Controllers","partSub":"Controllers, spares and accessories","disclaimer":"Category images are illustrations, not seller listings. Only actual seller listings appear in the marketplace.","photo":"Robot arm in a real factory","brand":"Explore makers visually","brandDesc":"Brand names are reference labels, not licensed manufacturer logos or authorized-dealer claims."},"ja":{"title":"写真から、もっと簡単に探す。","sub":"機器の種類を選び、実際の出品を検索できます。","robot":"ロボット","robotSub":"産業用・協働ロボット","gripper":"グリッパー・EOAT","gripperSub":"ハンド・真空・ツーリング","part":"部品・コントローラー","partSub":"制御機器・交換部品・周辺品","disclaimer":"カテゴリ画像はイメージ図です。実際の販売出品ではありません。","photo":"工場で稼働する実際のロボット","brand":"メーカーから探す","brandDesc":"メーカー名は参考表示です。正式ロゴや正規代理店の表示ではありません。"},"ko":{"title":"사진으로 보고, 쉽게 찾으세요.","sub":"로봇·그리퍼·부품을 선택하면 실제 등록된 상품을 검색합니다.","robot":"로봇","robotSub":"산업용·협동로봇","gripper":"그리퍼·EOAT","gripperSub":"그리퍼·진공·툴링","part":"부품·컨트롤러","partSub":"제어기·교체 부품·주변기기","disclaimer":"카테고리 그림은 설명용입니다. 실제 판매 매물은 판매자가 등록한 상품만 표시합니다.","photo":"실제 공장에서 작업하는 로봇","brand":"제조사별로 보기","brandDesc":"브랜드 이름은 참고 표시입니다. 제조사 공식 로고나 공식 판매 대리점이라는 뜻이 아닙니다."},"zh":{"title":"看得见，更好找。","sub":"按设备类型查找真实商品。","robot":"机器人","robotSub":"工业及协作机器人","gripper":"夹爪与 EOAT","gripperSub":"机械夹爪、真空及末端工具","part":"零件与控制器","partSub":"控制器、备件与配件","disclaimer":"类别图像仅为示意图，不代表实际在售商品。","photo":"工厂中的真实机器人","brand":"按制造商浏览","brandDesc":"品牌名称仅供参考，不代表授权商标或经销商资格。"},"de":{"title":"Ansehen. Finden.","sub":"Gerätetyp wählen und echte Angebote durchsuchen.","robot":"Roboter","robotSub":"Industrie- und Cobots","gripper":"Greifer & EOAT","gripperSub":"Greifer, Vakuum und Werkzeuge","part":"Teile & Steuerungen","partSub":"Steuerungen und Ersatzteile","disclaimer":"Illustrationen, keine Verkaufsangebote. Nur echte Inserate werden im Markt angezeigt.","photo":"Industrieroboter im Einsatz","brand":"Hersteller entdecken","brandDesc":"Markennamen dienen nur zur Orientierung; keine offiziellen Logos oder Händlernachweise."},"fr":{"title":"Voir. Trouver.","sub":"Choisissez un équipement et parcourez les annonces réelles.","robot":"Robots","robotSub":"Robots industriels et collaboratifs","gripper":"Préhenseurs & EOAT","gripperSub":"Préhenseurs, vide et outils","part":"Pièces & contrôleurs","partSub":"Contrôleurs et pièces détachées","disclaimer":"Images illustratives; seules les annonces réelles sont visibles dans la place de marché.","photo":"Bras robotisé en usine","brand":"Parcourir les fabricants","brandDesc":"Noms à titre indicatif; ni logos officiels ni statut de revendeur agréé."},"es":{"title":"Mira. Encuentra.","sub":"Elige el equipo y busca anuncios reales.","robot":"Robots","robotSub":"Robots industriales y colaborativos","gripper":"Pinzas y EOAT","gripperSub":"Pinzas, vacío y herramientas","part":"Piezas y controladores","partSub":"Controladores y repuestos","disclaimer":"Imágenes ilustrativas, no anuncios. Solo mostramos ofertas reales.","photo":"Robot industrial en una fábrica","brand":"Explorar fabricantes","brandDesc":"Nombres informativos, no logotipos oficiales ni autorizaciones de venta."},"it":{"title":"Guarda. Trova.","sub":"Scegli l'attrezzatura e cerca annunci reali.","robot":"Robot","robotSub":"Robot industriali e collaborativi","gripper":"Pinze ed EOAT","gripperSub":"Pinze, vuoto e utensili","part":"Ricambi e controller","partSub":"Controller e componenti","disclaimer":"Immagini illustrative, non inserzioni. Sono visibili solo annunci reali.","photo":"Robot industriale in fabbrica","brand":"Esplora i produttori","brandDesc":"Nomi solo informativi; non sono loghi ufficiali né autorizzazioni di vendita."},"pt":{"title":"Veja. Encontre.","sub":"Escolha o equipamento e busque anúncios reais.","robot":"Robôs","robotSub":"Robôs industriais e colaborativos","gripper":"Garras e EOAT","gripperSub":"Garras, vácuo e ferramentas","part":"Peças e controladores","partSub":"Controladores e peças","disclaimer":"Imagens ilustrativas, não anúncios. Só aparecem ofertas reais.","photo":"Robô industrial em fábrica","brand":"Explorar fabricantes","brandDesc":"Nomes de referência, não logotipos oficiais ou autorização de revenda."},"vi":{"title":"Xem trước. Tìm dễ hơn.","sub":"Chọn thiết bị để xem tin đăng thực tế.","robot":"Robot","robotSub":"Robot công nghiệp và cộng tác","gripper":"Tay gắp & EOAT","gripperSub":"Tay gắp, hút chân không và dụng cụ","part":"Linh kiện & bộ điều khiển","partSub":"Điều khiển và linh kiện thay thế","disclaimer":"Hình minh họa không phải hàng đang bán; chỉ có tin đăng thật trong chợ.","photo":"Robot thực tế trong nhà máy","brand":"Khám phá nhà sản xuất","brandDesc":"Tên hãng chỉ để tham khảo; không phải logo chính thức hay chứng nhận đại lý."}};
 const $=sel=>document.querySelector(sel);
 const $$=sel=>Array.from(document.querySelectorAll(sel));
 const lang=()=>document.documentElement.lang||'en';
 function apply(){
  const t=copy[lang()]||copy.en;
  const values={rqVisualMarketTitle:t.title,rqVisualMarketSubtitle:t.sub,rqVisualDisclaimer:t.disclaimer,rqHeroPhotoHeading:t.photo,rqBrandShowcaseTitle:t.brand,rqBrandShowcaseDesc:t.brandDesc,rqMarketDiscoveryTitle:t.title,rqDiscoveryNote:t.disclaimer};
  for(const [id,value] of Object.entries(values)){const el=document.getElementById(id);if(el)el.textContent=value}
  for(const k of ['robot','gripper','part']){
   const title=$('[data-rq-label="'+k+'"]'),note=$('[data-rq-sub="'+k+'"]');
   if(title)title.textContent=t[k];
   if(note)note.textContent=t[k+'Sub'];
   $$('[data-rq-market-category="'+k+'"]').forEach(btn=>{
    btn.setAttribute('aria-label',t[k]+': '+t[k+'Sub']);
    const label=btn.querySelector('[data-rq-label]');if(label)label.textContent=t[k];
    const sub=btn.querySelector('[data-rq-sub]');if(sub)sub.textContent=t[k+'Sub'];
   });
  }
  const clear=document.getElementById('rqVisualClear');
  if(clear)clear.textContent=({ja:'すべて表示',ko:'전체 상품 보기',zh:'显示全部',de:'Alle anzeigen',fr:'Tout afficher',es:'Ver todos',it:'Mostra tutto',pt:'Ver todos',vi:'Xem tất cả'})[lang()]||'Show all items';
  syncActiveCategory();
 }
 function syncActiveCategory(){
  const current=document.getElementById('categoryFilter')?.value||'';
  $$('.rq-market-discovery-card').forEach(btn=>{
   const selected=btn.dataset.rqMarketCategory===current;
   btn.setAttribute('aria-pressed',String(selected));
   btn.classList.toggle('is-active',selected);
  });
 }
 function openCategory(category){
  // This route has separate classifieds filters; never imply artwork is a listing.
  if(typeof window.route==='function')window.route('robots');
  window.rqRenderMarketplace?.(); // ensure current options exist before setting category
  const filter=document.getElementById('categoryFilter');
  if(!filter)return;
  if(!Array.from(filter.options).some(x=>x.value===category))return;
  filter.value=category;
  filter.dispatchEvent(new Event('change',{bubbles:true}));
  window.rqRenderMarketplace?.();
  syncActiveCategory();
  document.getElementById('rqMarketSearchArea')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function clearFilters(){
  const select=document.getElementById('categoryFilter');
  window.rqRenderMarketplace?.();
  for(const id of ['categoryFilter','countryFilter','conditionFilter','marketSearch']){
   const input=document.getElementById(id);
   if(input)input.value='';
  }
  if(select)select.dispatchEvent(new Event('change',{bubbles:true}));
  window.rqRenderMarketplace?.();
  syncActiveCategory();
 }
 function init(){
  $$('[data-rq-market-category]').forEach(btn=>btn.addEventListener('click',()=>openCategory(btn.dataset.rqMarketCategory)));
  document.getElementById('rqVisualClear')?.addEventListener('click',clearFilters);
  document.getElementById('categoryFilter')?.addEventListener('change',syncActiveCategory);
  document.addEventListener('rq:languagechange',apply);
  apply();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();