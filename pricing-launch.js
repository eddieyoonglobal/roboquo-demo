/* RoboQuo pricing proposal. INFORMATIVE ONLY; not a checkout or invoicing engine.
   Fees are not charged automatically. Managed services require separate seller
   agreement, compliance review, and acceptance before paid operations begin. */
(()=>{
 'use strict';
 const tiers=[
  {id:'directory',standard:0,promo:0},
  {id:'introduction',standard:5,promo:2.5},
  {id:'assisted',standard:10,promo:5},
  {id:'managed',standard:15,promo:7.5}
 ];
 const copy={
  ko:{
   title:'수수료 안내',lead:'출시 기념 · 유료 서비스 수수료 50% 할인 예정',
   badge:'도입 예정 요율',regular:'정규',intro:'출시 기념',fee:'성사 수수료',
   names:['상품 등록·업체 소개','구매자 소개·거래 중개','판매대행','종합 판매지원·위탁판매'],
   desc:['업체 정보와 제품을 무료로 소개','구매자 발굴과 기본 거래 조율','문의 대응·가격 협상·인도 일정 조율','별도 계약에 따른 전체 판매 진행 지원'],
   note:'무료 등록·업체 소개에는 수수료가 없습니다. 유료 서비스는 RoboQuo가 사전 계약에 따라 직접 참여하고 거래가 완료된 경우, 판매자에게만 부과할 예정입니다. 소비세와 운송·철거·검수 등 실비는 별도입니다.',
   pending:'※ 현재는 요금 정책 안내 단계이며 자동 결제·수수료 청구를 시행하지 않습니다. 위탁판매 등은 관련 인허가와 운영 계약 체계를 확인한 후 개시합니다.',
   discount:'출시 초기 최대 20건의 유료 서비스 계약을 대상으로 검토 중이며, 적용 기간과 조건은 계약 전에 별도 공지합니다.',
   zero:'무료',pct:percent=>percent+'%',cta:'상품 등록하기'},
  ja:{
   title:'手数料のご案内',lead:'オープン記念・有料サービス手数料50%OFF（予定）',
   badge:'導入予定の料金',regular:'通常',intro:'オープン記念',fee:'成約手数料',
   names:['商品掲載・企業紹介','購入者紹介・取引仲介','販売代行','総合販売支援・委託販売'],
   desc:['企業情報・商品掲載は無料','購入希望者の紹介と基本的な取引調整','お問い合わせ対応、価格交渉、引渡し日程の調整','別途契約に基づく販売プロセス全体の支援'],
   note:'掲載・企業紹介は無料です。有料サービスの手数料は、事前契約に基づきRoboQuoが取引に関与し、成約した場合に売主からいただく想定です。消費税、運搬・撤去・検品等の実費は別途となります。',
   pending:'※ 現在は予定料金のご案内です。自動決済・手数料請求は開始していません。委託販売等は必要な許認可・契約体制を確認した上で開始します。',
   discount:'オープン後の有料サービス契約先着20件を対象に検討中です。適用期間・条件は契約前に別途ご案内します。',
   zero:'無料',pct:percent=>percent+'%',cta:'商品を出品する'},
  en:{
   title:'Fees & services',lead:'Launch offer · 50% off paid-service commissions (proposed)',
   badge:'Proposed rates',regular:'Standard',intro:'Launch offer',fee:'Success fee',
   names:['Free listings & company profiles','Buyer introductions & brokerage','Assisted sales','Full consignment support'],
   desc:['Publish product and company information at no charge','Buyer discovery and basic negotiation support','Coordinate inquiries, pricing and handover','Full sales coordination by separate agreement'],
   note:'Listings and company profiles are free. Paid success fees would be charged to the seller only for completed transactions handled by RoboQuo under a prior agreement. Taxes and transport, removal and inspection costs are separate.',
   pending:'Proposed rates only: no automatic payment or commission collection is active. Consignment services will launch only after required licenses and contractual arrangements are confirmed.',
   discount:'Under consideration for the first 20 qualifying paid-service agreements after launch. Dates and eligibility will be disclosed before contracting.',
   zero:'Free',pct:percent=>percent+'%',cta:'Post a listing'},
  zh:{
   title:'服务费标准',lead:'开业优惠 · 付费服务佣金五折（拟定）',
   badge:'拟定收费',regular:'标准',intro:'开业优惠',fee:'成交佣金',
   names:['免费发布与企业介绍','买家介绍与交易撮合','代理销售','全程委托销售支持'],
   desc:['免费展示商品及企业信息','寻找买家并协助基本交易','询价、价格协商与交货协调','根据单独合同提供全程销售支持'],
   note:'商品发布及企业介绍免费。付费服务拟仅在事先签约、RoboQuo参与且交易完成时向卖方收费。税费、运输、拆卸及检验费用另计。',
   pending:'当前仅为拟定价格说明，尚未启用自动扣费或佣金收取。委托销售须在确认所需许可及合同后启动。',
   discount:'拟面向上线后的前20份合格付费服务合同，具体日期与条件将于签约前公布。',
   zero:'免费',pct:p=>p+'%',cta:'发布商品'},
  de:{
   title:'Gebühren',lead:'Startangebot · 50 % Rabatt auf Provisionen (geplant)',
   badge:'Geplante Gebühren',regular:'Standard',intro:'Zum Start',fee:'Erfolgsprovision',
   names:['Anzeigen & Firmenprofile','Käufervermittlung','Verkaufsunterstützung','Komplette Kommissionsabwicklung'],
   desc:['Kostenlose Präsentation','Käufer finden und Kontakte vermitteln','Anfragen und Übergabe koordinieren','Umfassende Unterstützung nach separatem Vertrag'],
   note:'Einträge sind kostenlos. Kostenpflichtige Provisionen sollen nur bei erfolgreichem, vereinbartem Abschluss vom Verkäufer erhoben werden. Steuern und Nebenkosten extra.',
   pending:'Noch nicht aktiv: Keine automatische Zahlung oder Rechnungsstellung. Kommissionsverkauf erst nach Klärung rechtlicher Voraussetzungen.',
   discount:'Vorgesehen für die ersten 20 geeigneten kostenpflichtigen Verträge. Bedingungen vor Vertragsabschluss.',
   zero:'Kostenlos',pct:p=>p+'%',cta:'Artikel einstellen'},
  fr:{
   title:'Tarifs',lead:'Offre de lancement · commissions à -50 % (projet)',
   badge:'Tarifs envisagés',regular:'Habituel',intro:'Lancement',fee:'Commission au succès',
   names:['Annonces et profils gratuits','Mise en relation','Vente accompagnée','Mandat de vente complet'],
   desc:['Présentez gratuitement votre activité','Recherche d’acheteurs et mise en relation','Coordination des négociations','Service complet sur contrat distinct'],
   note:'Annonces gratuites. Les commissions seraient dues par le vendeur seulement après une vente conclue avec l’intervention convenue de RoboQuo. Taxes et frais annexes en sus.',
   pending:'Tarifs indicatifs : aucun paiement automatique ni prélèvement. Le mandat de vente sera proposé après vérification des autorisations requises.',
   discount:'Envisagé pour les 20 premiers contrats admissibles. Conditions annoncées avant signature.',
   zero:'Gratuit',pct:p=>p+'%',cta:'Publier une annonce'},
  es:{
   title:'Tarifas',lead:'Lanzamiento · 50 % de descuento en comisiones (propuesta)',
   badge:'Precios propuestos',regular:'Habitual',intro:'Lanzamiento',fee:'Comisión por venta',
   names:['Anuncios y empresas gratis','Contacto con compradores','Venta asistida','Consignación integral'],
   desc:['Publicación gratuita','Búsqueda y contacto con compradores','Gestión de consultas y negociación','Gestión integral bajo contrato separado'],
   note:'Publicar es gratis. Las comisiones solo se cobrarían al vendedor por ventas cerradas con la intervención pactada de RoboQuo. Impuestos y gastos adicionales aparte.',
   pending:'Solo propuesta: pagos y comisiones automáticos aún no disponibles. La consignación requiere validar autorizaciones.',
   discount:'Previsto para los 20 primeros contratos elegibles; condiciones antes de contratar.',
   zero:'Gratis',pct:p=>p+'%',cta:'Publicar un anuncio'},
  it:{
   title:'Commissioni',lead:'Lancio · commissioni scontate del 50% (proposta)',
   badge:'Tariffe proposte',regular:'Standard',intro:'Lancio',fee:'Commissione a risultato',
   names:['Annunci e profili gratuiti','Segnalazione acquirenti','Vendita assistita','Vendita in conto vendita'],
   desc:['Pubblicazione gratuita','Ricerca e presentazione acquirenti','Assistenza nelle trattative','Gestione completa su accordo separato'],
   note:'Annunci gratuiti. Eventuali commissioni spettano al venditore solo a vendita conclusa con intervento concordato di RoboQuo. Tasse e spese ulteriori escluse.',
   pending:'Solo proposta: nessun addebito automatico attivo. I servizi in conto vendita richiedono verifiche legali.',
   discount:'Ipotesi per i primi 20 contratti idonei; condizioni comunicate prima della firma.',
   zero:'Gratis',pct:p=>p+'%',cta:'Pubblica un annuncio'},
  pt:{
   title:'Comissões',lead:'Lançamento · 50% de desconto (proposta)',
   badge:'Tarifas propostas',regular:'Normal',intro:'Lançamento',fee:'Comissão por venda',
   names:['Anúncios e empresas grátis','Indicação de compradores','Venda assistida','Consignação completa'],
   desc:['Publique gratuitamente','Busca e apresentação de compradores','Apoio a negociações e entrega','Serviço completo mediante contrato separado'],
   note:'Anúncios gratuitos. A comissão seria cobrada apenas do vendedor após negócio concluído com atuação contratada da RoboQuo. Impostos e despesas à parte.',
   pending:'Proposta apenas: cobrança automática não está disponível. Consignação depende de verificações legais.',
   discount:'Em estudo para os 20 primeiros contratos elegíveis, com condições informadas antecipadamente.',
   zero:'Grátis',pct:p=>p+'%',cta:'Publicar produto'},
  vi:{
   title:'Phí dịch vụ',lead:'Ưu đãi ra mắt · giảm 50% hoa hồng (dự kiến)',
   badge:'Mức phí dự kiến',regular:'Thông thường',intro:'Ra mắt',fee:'Hoa hồng thành công',
   names:['Đăng tin và giới thiệu doanh nghiệp','Giới thiệu người mua','Hỗ trợ bán hàng','Ký gửi toàn diện'],
   desc:['Miễn phí giới thiệu sản phẩm','Tìm kiếm và kết nối người mua','Hỗ trợ đàm phán và bàn giao','Hỗ trợ toàn bộ theo hợp đồng riêng'],
   note:'Đăng tin miễn phí. Hoa hồng chỉ dự kiến thu từ người bán khi giao dịch hoàn tất theo thỏa thuận trước. Thuế và chi phí phát sinh tính riêng.',
   pending:'Đây là đề xuất, chưa thu phí tự động. Dịch vụ ký gửi chỉ mở khi đáp ứng yêu cầu pháp lý.',
   discount:'Dự kiến cho 20 hợp đồng dịch vụ đủ điều kiện đầu tiên. Điều kiện công bố trước khi ký.',
   zero:'Miễn phí',pct:p=>p+'%',cta:'Đăng bán'}
 };
 const $=id=>document.getElementById(id);
 const lang=()=>copy[document.documentElement.lang]||copy.en;
 function render(){
  if(!$('rqPricing'))return;
  const t=lang();
  $('rqPricingTitle').textContent=t.title;
  $('rqPricingLead').textContent=t.lead;
  $('rqPricingStatus').textContent=t.badge;
  const grid=$('rqPricingGrid');grid.replaceChildren();
  for(let i=0;i<tiers.length;i++){
    const tier=tiers[i],article=document.createElement('article');
    article.className='rq-fee-plan'+(i===2?' rq-fee-highlight':'');
    article.dataset.tier=tier.id;
    const name=document.createElement('h3');name.textContent=t.names[i];
    const desc=document.createElement('p');desc.className='rq-fee-desc';desc.textContent=t.desc[i];
    const info=document.createElement('div');info.className='rq-fee-numbers';
    const regular=document.createElement('span');regular.className='rq-fee-regular';
    const promo=document.createElement('strong');promo.className='rq-fee-promo';
    if(i===0){promo.textContent=t.zero;}
    else{
      regular.textContent=t.regular+' '+t.pct(tier.standard);
      promo.textContent=t.intro+' '+t.pct(tier.promo);
    }
    info.append(regular,promo);article.append(name,desc,info);grid.append(article);
  }
  $('rqPricingNote').textContent=t.note;
  $('rqPricingPending').textContent=t.pending;
  $('rqPricingDiscount').textContent=t.discount;
 }
 function init(){
  if(!$('rqPricing'))return;
  render();
  document.getElementById('languageSelect')?.addEventListener('change',()=>queueMicrotask(render));
  document.addEventListener('rq:languagechange',render);
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.RQ_PRICING_REPORT=()=>({
    isProposed:true,automaticBilling:false,
    tiers:tiers.map(x=>({...x})),
    locale:document.documentElement.lang,
    visibleCards:$('rqPricingGrid').children.length
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
