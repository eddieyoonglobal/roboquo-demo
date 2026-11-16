/* RoboQuo public fee guide. Display-only: no checkout, charge, or payment authorization. */
(()=>{
 'use strict';
 const RATES=Object.freeze({direct:{regular:0,promo:0},intro:{regular:5,promo:2.5},agency:{regular:10,promo:5}});
 const COPY={
 ko:{
  eyebrow:'ROBOQUO 요금 안내',title:'먼저 무료로 시작하세요. 거래 지원은 필요한 만큼.',
  entryTitle:'상품 등록은 무료. 거래 지원 요금 확인',entryAction:'수수료 안내 보기',
  lead:'업체 소개와 직접 상품 등록은 무료입니다. RoboQuo가 실제로 구매자를 연결하거나 판매대행을 맡는 경우에만 별도 합의에 따라 성공 수수료가 발생합니다.',
  status:'출시 초기 수수료 제안 · 적용 조건은 사전 협의',
  plans:[['업체 소개 · 직접 등록','업체 프로필, 상품 등록, 기본 문의 기능','무료'],['거래 중개','RoboQuo가 구매자를 소개하고 거래 협의를 지원','성사 시'],['판매대행','상품 소개, 구매자 발굴, 협상·거래 조율을 위탁','성사 시']],
  standard:'정상 수수료',offer:'출시 기념 50% 할인',free:'무료',fromSale:'판매 성사 시',tax:'소비세 별도(해당하는 경우)',
  exampleTitle:'예상 수수료 계산',exampleLead:'실제 판매가를 입력하면 출시 기념 요금과 정상 요금을 비교할 수 있습니다. 자동 청구나 결제는 진행되지 않습니다.',
  amount:'성사 금액 (JPY, 세금·운송비 제외)',service:'서비스',current:'출시 기념 수수료',normal:'정상 수수료',saved:'할인 금액',taxNote:'위 금액은 세전 수수료 예시입니다. 일본 내 과세되는 서비스에는 별도로 소비세가 적용될 수 있습니다.',
  noteTitle:'적용 기준',rules:[
   '판매자·구매자의 직접 거래와 단순 상품 등록은 무료입니다. 등록만 했다고 중개 수수료를 청구하지 않습니다.',
   '중개·판매대행 요금은 RoboQuo가 실제로 해당 업무를 맡기로 사전에 합의한 거래에만 적용됩니다.',
   '거래 성사 기준, 수수료 대상 금액, 캠페인 적용 기간 및 상한·대형 거래 조건은 계약 전에 서면으로 확정합니다.',
   '배송·반출·설치·점검 등 현장 서비스는 별도 견적이며, 거래가 성사되지 않으면 성공 수수료는 발생하지 않습니다.',
   '현재는 요금 안내 단계이며 수수료의 자동 정산·결제 기능은 제공하지 않습니다.'
  ],
  inquiry:'서비스 상담 문의',back:'이용 안내로 돌아가기',select:['직접 등록 · 무료','거래 중개','판매대행'],
  note:'RoboQuo는 통화 환산이나 결제·대금 보관을 하지 않습니다. 법령상 필요한 인허가·세금·계약 확인 후 개별 서비스를 제공합니다.'
 },
 ja:{
  eyebrow:'ROBOQUO 料金のご案内',title:'掲載は無料。必要な取引支援だけを。',
  entryTitle:'出品無料・取引支援の料金について',entryAction:'料金・手数料を見る',
  lead:'企業紹介と商品の直接出品は無料です。RoboQuoによる買い手紹介や販売代行をご依頼いただく場合のみ、事前の合意に基づいて成約手数料が発生します。',
  status:'ローンチ向け料金案・適用条件は事前協議',
  plans:[['企業紹介・直接出品','企業プロフィール、商品掲載、基本的なお問い合わせ','無料'],['取引仲介','RoboQuoが買い手を紹介し、商談を支援','成約時のみ'],['販売代行','商品掲載支援、買い手探し、交渉・取引調整','成約時のみ']],
  standard:'通常手数料',offer:'ローンチ記念 50％OFF',free:'無料',fromSale:'成約時',tax:'消費税別途（該当する場合）',
  exampleTitle:'手数料シミュレーション',exampleLead:'成約金額からキャンペーン料金と通常料金を比較できます。ここから請求や決済は行われません。',
  amount:'成約金額（円・税金／輸送費を除く）',service:'サービス',current:'キャンペーン手数料',normal:'通常手数料',saved:'割引額',taxNote:'表示額は税抜の参考額です。日本国内の課税対象となる役務には、別途消費税がかかる場合があります。',
  noteTitle:'適用条件',rules:[
   '企業紹介、商品の掲載、当事者間の直接商談は無料です。掲載だけで仲介手数料は発生しません。',
   '仲介・販売代行は、事前に業務範囲を合意し、RoboQuoが実際に対応した取引に限ります。',
   '成約の定義、手数料算定額、キャンペーン適用期間、上限額や高額取引の条件は契約前に書面でご案内します。',
   '搬出・輸送・設置・点検などは別途お見積りです。不成立の場合、成果報酬は発生しません。',
   '現在は料金のご案内段階であり、自動決済・自動請求には対応していません。'
  ],
  inquiry:'取引支援について相談する',back:'ご利用案内に戻る',select:['直接出品・無料','取引仲介','販売代行'],
  note:'RoboQuoによる為替換算・代金預かりは行いません。必要な許認可、税務および契約条件を確認のうえ、個別に対応します。'
 },
 en:{
  eyebrow:'ROBOQUO SERVICE FEES',title:'List for free. Pay only for the support you need.',
  entryTitle:'Free listings and transparent transaction support fees',entryAction:'View fees',
  lead:'Company profiles and direct item listings are free. A success fee applies only when you separately engage RoboQuo for buyer introductions or a managed sale.',
  status:'Proposed launch rates · terms agreed before service',
  plans:[['Company profile & direct listing','Company profile, product posting and basic inquiries','Free'],['Transaction introduction','RoboQuo finds a buyer and supports the negotiation','On completion'],['Managed sale','Listing assistance, buyer outreach and transaction coordination','On completion']],
  standard:'Standard fee',offer:'Launch offer · 50% off',free:'Free',fromSale:'When sold',tax:'Tax extra where applicable',
  exampleTitle:'Estimate a transaction fee',exampleLead:'Compare launch and standard fees at a sample sale price. This estimate does not charge or collect payments.',
  amount:'Sale price (JPY, excluding tax and logistics)',service:'Service',current:'Launch fee',normal:'Standard fee',saved:'Discount',taxNote:'Figures exclude tax. Japanese consumption tax may apply to taxable domestic services.',
  noteTitle:'How fees work',rules:[
   'Company introductions, direct item listings and direct buyer–seller negotiation are free. Listing alone never triggers a commission.',
   'Commission applies only after a seller has expressly engaged RoboQuo to broker or manage a specific transaction.',
   'Completion milestone, fee calculation base, promotion eligibility and timing, caps and large-deal terms are agreed in writing first.',
   'Inspection, dismantling, logistics and installation are quoted separately. No successful sale means no success fee.',
   'This is a proposed rate guide; automated commissions, checkout and settlement are not available.'
  ],
  inquiry:'Ask about transaction support',back:'Back to How it Works',select:['Direct listing — free','Transaction introduction','Managed sale'],
  note:'No automatic currency conversion or payment custody. Any legally required licensing, tax treatment and contract terms must be checked before service.'
 },
 de:{
  eyebrow:'ROBOQUO GEBÜHREN',title:'Kostenlos inserieren. Nur benötigte Unterstützung bezahlen.',
  entryTitle:'Kostenlose Anzeigen und transparente Vermittlungsgebühren',entryAction:'Gebühren ansehen',
  lead:'Firmenprofile und direkte Inserate sind kostenlos. Erfolgsgebühren gelten nur nach gesonderter Beauftragung der Käufervermittlung oder Verkaufsbegleitung.',
  status:'Geplante Einführungstarife · Bedingungen vorab vereinbaren',
  plans:[['Firmenprofil & Inserat','Profil, Anzeige und direkte Anfrage','Kostenlos'],['Käufervermittlung','Käufer finden und Verhandlung begleiten','Bei Abschluss'],['Verkaufsservice','Inserat, Käuferansprache und Abwicklung unterstützen','Bei Abschluss']],
  standard:'Normale Gebühr',offer:'Startangebot · 50 % Rabatt',free:'Kostenlos',fromSale:'Bei Abschluss',tax:'zzgl. Steuer, sofern anwendbar',
  exampleTitle:'Gebühren berechnen',exampleLead:'Unverbindliche Schätzung. Hier erfolgt keine Zahlung oder Abbuchung.',
  amount:'Verkaufspreis (JPY, ohne Steuer und Transport)',service:'Service',current:'Aktionsgebühr',normal:'Normale Gebühr',saved:'Ersparnis',
  taxNote:'Beträge ohne Steuern; für steuerpflichtige Leistungen in Japan kann Umsatzsteuer anfallen.',
  noteTitle:'Bedingungen',rules:['Direkte Inserate und Verhandlungen zwischen den Parteien sind kostenlos.','Vermittlung oder Verkaufsservice nur nach ausdrücklicher Beauftragung.','Abschluss, Berechnungsgrundlage, Aktionszeitraum und Konditionen für große Geschäfte werden vorher schriftlich festgelegt.','Prüfung, Transport und Installation werden separat angeboten; ohne Abschluss keine Erfolgsgebühr.','Derzeit keine automatische Abrechnung oder Zahlungsabwicklung.'],
  inquiry:'Beratung zu Transaktionen',back:'Zurück zur Anleitung',select:['Direkt inserieren','Käufervermittlung','Verkaufsservice'],
  note:'Keine automatische Währungsumrechnung oder Geldverwahrung. Rechtliche und steuerliche Voraussetzungen sind vorab zu prüfen.'
 },
 fr:{
  eyebrow:'FRAIS ROBOQUO',title:'Annonce gratuite. Assistance payante uniquement sur demande.',
  entryTitle:'Annonces gratuites et commissions transparentes',entryAction:'Voir les tarifs',
  lead:'La présentation des entreprises et la publication directe sont gratuites. Une commission s’applique uniquement si vous mandatez RoboQuo pour rechercher un acheteur ou gérer la vente.',
  status:'Tarifs de lancement proposés · conditions convenues avant mission',
  plans:[['Entreprise et annonce','Profil, annonce et demandes directes','Gratuit'],['Mise en relation','Recherche d’acheteur et aide à la négociation','Après vente'],['Vente accompagnée','Mise en ligne, prospection et coordination','Après vente']],
  standard:'Tarif normal',offer:'Offre de lancement · −50 %',free:'Gratuit',fromSale:'Après vente',tax:'Taxes en sus, si applicables',
  exampleTitle:'Estimation des frais',exampleLead:'Simulation sans engagement, sans prélèvement ni paiement.',
  amount:'Prix de vente (JPY, hors taxes et transport)',service:'Prestation',current:'Tarif de lancement',normal:'Tarif normal',saved:'Économie',
  taxNote:'Montants hors taxes. La taxe japonaise sur la consommation peut s’appliquer.',
  noteTitle:'Conditions',rules:['Annonces et négociations directes entre vendeur et acheteur gratuites.','Mise en relation ou accompagnement uniquement sur mandat préalable.','Définition de la vente, base de calcul, durée de l’offre et transactions importantes précisées par écrit.','Inspection, transport et installation sur devis ; pas de commission sans vente conclue.','Pas encore de facturation ni de paiement automatiques.'],
  inquiry:'Demander un accompagnement',back:'Retour au guide',select:['Annonce gratuite','Mise en relation','Vente accompagnée'],
  note:'Pas de conversion automatique des devises ni de conservation de fonds. Vérification préalable des règles juridiques et fiscales.'
 },
 es:{
  eyebrow:'TARIFAS ROBOQUO',title:'Publica gratis. Paga solo por la asistencia contratada.',
  entryTitle:'Anuncios gratis y comisiones transparentes',entryAction:'Ver tarifas',
  lead:'Los perfiles de empresas y anuncios directos son gratuitos. Solo se aplica una comisión si contratas a RoboQuo para presentar compradores o gestionar una venta.',
  status:'Tarifas propuestas de lanzamiento · condiciones por acuerdo previo',
  plans:[['Perfil y anuncio','Perfil, publicación y consultas directas','Gratis'],['Intermediación','Presentación de compradores y negociación','Al cerrar'],['Venta gestionada','Anuncio, búsqueda de clientes y coordinación','Al cerrar']],
  standard:'Comisión habitual',offer:'Oferta de lanzamiento · 50 % dto.',free:'Gratis',fromSale:'Al cerrar',tax:'Impuestos adicionales si procede',
  exampleTitle:'Calculadora de comisiones',exampleLead:'Estimación informativa, sin pagos ni cargos automáticos.',
  amount:'Importe de venta (JPY, sin impuestos ni transporte)',service:'Servicio',current:'Comisión promocional',normal:'Comisión habitual',saved:'Ahorro',
  taxNote:'Importes sin impuestos. Puede aplicarse el impuesto japonés sobre el consumo.',
  noteTitle:'Condiciones',rules:['Publicación y negociación directa entre las partes: gratis.','Intermediación y gestión solo con encargo previo.','Criterio de cierre, base de cálculo, promoción y grandes operaciones se acuerdan por escrito.','Inspección, transporte e instalación se presupuestan aparte; sin venta no hay comisión.','Sin pagos ni liquidaciones automáticos por el momento.'],
  inquiry:'Consultar asistencia de venta',back:'Volver a la guía',select:['Publicación gratuita','Intermediación','Venta gestionada'],
  note:'Sin conversión automática de divisas ni custodia de fondos. Se verifican los requisitos legales y fiscales.'
 },
 it:{
  eyebrow:'TARIFFE ROBOQUO',title:'Pubblica gratis. Paghi solo l’assistenza richiesta.',
  entryTitle:'Annunci gratuiti e commissioni trasparenti',entryAction:'Visualizza tariffe',
  lead:'Profili aziendali e annunci diretti sono gratuiti. La commissione si applica solo con incarico separato di intermediazione o vendita assistita.',
  status:'Tariffe lancio proposte · termini da concordare',
  plans:[['Profilo e annuncio','Profilo, annuncio e richieste dirette','Gratis'],['Intermediazione','Ricerca acquirente e supporto trattativa','A vendita conclusa'],['Vendita assistita','Annuncio, contatti e coordinamento','A vendita conclusa']],
  standard:'Commissione ordinaria',offer:'Offerta lancio · sconto 50%',free:'Gratis',fromSale:'A vendita conclusa',tax:'Imposte escluse, se applicabili',
  exampleTitle:'Calcolo commissioni',exampleLead:'Stima indicativa; nessun addebito o pagamento.',
  amount:'Prezzo vendita (JPY, senza tasse e trasporto)',service:'Servizio',current:'Commissione lancio',normal:'Commissione ordinaria',saved:'Risparmio',
  taxNote:'Importi al netto delle imposte. Potrebbe applicarsi l’imposta giapponese sui consumi.',
  noteTitle:'Condizioni',rules:['Annunci e trattative dirette sono gratuiti.','L’intermediazione richiede un incarico esplicito.','Vendita conclusa, base di calcolo, durata promo e grandi transazioni si concordano per iscritto.','Ispezione, trasporto e installazione sono a preventivo; senza vendita, nessuna commissione.','Non sono previsti addebiti o pagamenti automatici.'],
  inquiry:'Richiedi assistenza',back:'Torna alla guida',select:['Annuncio gratuito','Intermediazione','Vendita assistita'],
  note:'Nessuna conversione automatica o custodia fondi. Requisiti legali e fiscali da verificare.'
 },
 pt:{
  eyebrow:'TARIFAS ROBOQUO',title:'Anuncie grátis. Pague apenas pela assistência necessária.',
  entryTitle:'Anúncios grátis e comissões transparentes',entryAction:'Ver tarifas',
  lead:'Perfis de empresas e anúncios diretos são gratuitos. A comissão aplica-se apenas quando o RoboQuo é contratado para apresentar compradores ou gerir vendas.',
  status:'Tarifas de lançamento propostas · condições a acordar',
  plans:[['Perfil e anúncio','Perfil, anúncio e contactos diretos','Grátis'],['Intermediação','Encontrar comprador e apoiar negociação','Na venda'],['Venda assistida','Anúncio, prospeção e coordenação','Na venda']],
  standard:'Comissão normal',offer:'Promoção de lançamento · 50% desconto',free:'Grátis',fromSale:'Na venda',tax:'Impostos adicionais, quando aplicáveis',
  exampleTitle:'Simulador de comissão',exampleLead:'Estimativa sem pagamentos ou cobranças automáticas.',
  amount:'Preço da venda (JPY, sem impostos e transporte)',service:'Serviço',current:'Comissão promocional',normal:'Comissão normal',saved:'Poupança',
  taxNote:'Valores sem impostos; o imposto de consumo do Japão pode aplicar-se.',
  noteTitle:'Condições',rules:['Anúncios e negociações diretas são grátis.','A intermediação requer contratação prévia.','Conclusão, base de cálculo, prazo promocional e negócios de grande valor definidos por escrito.','Inspeção, transporte e instalação orçamentados separadamente; sem venda não há comissão.','Sem faturação ou pagamento automático neste momento.'],
  inquiry:'Pedir apoio comercial',back:'Voltar ao guia',select:['Anúncio gratuito','Intermediação','Venda assistida'],
  note:'Sem câmbio automático ou custódia de fundos. Verificam-se requisitos legais e fiscais.'
 },
 vi:{
  eyebrow:'PHÍ DỊCH VỤ ROBOQUO',title:'Đăng tin miễn phí. Chỉ trả phí khi cần hỗ trợ giao dịch.',
  entryTitle:'Đăng tin miễn phí và phí giao dịch rõ ràng',entryAction:'Xem biểu phí',
  lead:'Giới thiệu doanh nghiệp và đăng tin trực tiếp miễn phí. Chỉ tính phí khi bạn thuê RoboQuo giới thiệu người mua hoặc hỗ trợ bán hàng.',
  status:'Mức phí dự kiến khi ra mắt · thỏa thuận trước khi sử dụng',
  plans:[['Doanh nghiệp và đăng tin','Hồ sơ, đăng tin và hỏi đáp trực tiếp','Miễn phí'],['Môi giới giao dịch','Giới thiệu người mua, hỗ trợ thương lượng','Khi bán thành công'],['Bán hàng ủy thác','Đăng tin, tìm khách và điều phối giao dịch','Khi bán thành công']],
  standard:'Phí thông thường',offer:'Ưu đãi ra mắt · giảm 50%',free:'Miễn phí',fromSale:'Khi bán thành công',tax:'Chưa bao gồm thuế (nếu có)',
  exampleTitle:'Ước tính phí',exampleLead:'Chỉ để tham khảo; không thanh toán hay trừ tiền tự động.',
  amount:'Giá bán (JPY, chưa gồm thuế và vận chuyển)',service:'Dịch vụ',current:'Phí ưu đãi',normal:'Phí thông thường',saved:'Tiết kiệm',
  taxNote:'Số tiền chưa bao gồm thuế; dịch vụ chịu thuế tại Nhật có thể phải trả thuế tiêu dùng.',
  noteTitle:'Điều kiện',rules:['Đăng tin và giao dịch trực tiếp giữa hai bên miễn phí.','Phí môi giới chỉ áp dụng khi có thỏa thuận thuê RoboQuo trước.','Điều kiện hoàn tất, mức tính phí, thời gian ưu đãi và giao dịch lớn được xác nhận bằng văn bản.','Kiểm tra, vận chuyển, lắp đặt báo giá riêng; không bán được thì không có phí thành công.','Chưa có thu phí hoặc thanh toán tự động.'],
  inquiry:'Hỏi về hỗ trợ giao dịch',back:'Quay lại hướng dẫn',select:['Đăng tin miễn phí','Môi giới','Bán hàng ủy thác'],
  note:'Không tự quy đổi tiền tệ hay giữ tiền giao dịch; cần xác nhận các yêu cầu pháp lý và thuế.'
 },
 zh:{
  eyebrow:'ROBOQUO 服务收费',title:'免费发布，仅为需要的交易服务付费',
  entryTitle:'免费发布与透明的交易服务费',entryAction:'查看收费方案',
  lead:'企业介绍和直接发布商品免费。仅在事先委托 RoboQuo 寻找买家或代理销售时，按书面约定收取成交服务费。',
  status:'上线初期费率方案 · 具体条件事先商定',plans:[['企业介绍·直接发布','企业信息、商品发布及咨询','免费'],['交易撮合','买家介绍与交易沟通','成交后'],['代理销售','发布协助、寻找买家、谈判与协调','成交后']],
  standard:'常规费率',offer:'上线优惠：五折',free:'免费',fromSale:'成交后',tax:'税费另计（如适用）',
  exampleTitle:'费用估算',exampleLead:'按成交价比较优惠与正常费用。本页面不产生付款或扣费。',amount:'成交金额（日元，不含税及物流）',service:'服务',current:'优惠费用',normal:'常规费用',saved:'优惠金额',taxNote:'金额不含税。日本境内应税服务可能另收消费税。',noteTitle:'适用条件',
  rules:['直接发布及买卖双方自主交易免费。','需事先委托 RoboQuo 提供撮合或销售代理服务。','成交标准、计费金额、活动期限及高价值交易条件应提前书面确认。','运输、检测、安装另行报价；未成交不收成功佣金。','目前仅展示费率方案，尚无自动结算功能。'],
  inquiry:'咨询交易服务',back:'返回使用指南',select:['直接发布·免费','交易撮合','代理销售'],note:'不自动换汇或代收货款；服务以合法许可、税务和书面合同为前提。'
 }
 };
 const chooseLanguage=()=>{
  const v=document.querySelector('#languageSelect')?.value||document.documentElement.lang||'en';
  return COPY[v]||COPY.en;
 };
 const routes=['direct','intro','agency'];
 const jpy=n=>'¥'+Math.round(n).toLocaleString('ja-JP');
 const $=id=>document.getElementById(id);
 function node(tag,className,text){const v=document.createElement(tag);if(className)v.className=className;if(text!==undefined)v.textContent=text;return v;}
 function render(){
  const root=$('rqFeesMount');if(!root)return;
  const t=chooseLanguage();root.replaceChildren();
  const entryTitle=$('rqFeesEntryTitle'),entryAction=$('rqFeesEntryAction');
  if(entryTitle)entryTitle.textContent=t.entryTitle||COPY.en.entryTitle;
  if(entryAction)entryAction.textContent=t.entryAction||COPY.en.entryAction;
  const head=node('header','rq-fees-head');
  head.append(node('span','rq-fees-kicker',t.eyebrow));
  const title=node('h1','rq-fees-title',t.title);title.id='rqFeeTitle';head.append(title);
  head.append(node('p','rq-fees-lead',t.lead));
  head.append(node('p','rq-fees-status',t.status));root.append(head);
  const cards=node('div','rq-fees-cards');
  for(let i=0;i<3;i++){
   const rate=RATES[routes[i]], card=node('article','rq-fees-card');
   const [name,desc,sub]=t.plans[i];
   card.append(node('h2','rq-fees-card-title',name),node('p','rq-fees-description',desc));
   const price=node('div','rq-fees-prices');
   price.append(node('span','rq-fees-regular',t.standard+'  '+(rate.regular?rate.regular+'%':t.free)));
   price.append(node('strong','rq-fees-promo',rate.promo?rate.promo+'%':t.free));
   if(rate.promo)price.append(node('span','rq-fees-offer',t.offer));
   card.append(price,node('p','rq-fees-card-caption',rate.promo?sub+' · '+t.tax:sub));
   cards.append(card);
  }
  root.append(cards);
  const example=node('section','rq-fees-example');
  example.append(node('h2','',t.exampleTitle),node('p','',t.exampleLead));
  const inputs=node('div','rq-fees-example-inputs');
  const amountLabel=node('label','',t.amount);
  const amount=node('input');amount.id='rqFeeAmount';amount.type='number';amount.min='0';amount.step='1000';amount.inputMode='numeric';amount.value='1000000';
  amountLabel.append(amount);
  const serviceLabel=node('label','',t.service);
  const type=node('select');type.id='rqFeeType';
  routes.forEach((id,i)=>{const option=node('option','',t.select[i]);option.value=id;if(id==='intro')option.selected=true;type.append(option)});
  serviceLabel.append(type);inputs.append(amountLabel,serviceLabel);example.append(inputs);
  const figures=node('div','rq-fees-example-results');figures.setAttribute('aria-live','polite');
  const rates=[[t.current,'promo'],[t.normal,'regular'],[t.saved,'discount']];
  const values={};
  for(const [title,key] of rates){const el=node('div','rq-fees-result');el.append(node('span','',title));const val=node('strong','','—');values[key]=val;el.append(val);figures.append(el)}
  example.append(figures,node('p','rq-fees-tax-note',t.taxNote));root.append(example);
  const update=()=>{
   const price=Number(amount.value),rate=RATES[type.value]||RATES.direct;
   if(!Number.isFinite(price)||price<0){Object.values(values).forEach(v=>v.textContent='—');return}
   values.regular.textContent=jpy(price*rate.regular/100);
   values.promo.textContent=jpy(price*rate.promo/100);
   values.discount.textContent=jpy(price*(rate.regular-rate.promo)/100);
  };
  amount.addEventListener('input',update);type.addEventListener('change',update);update();
  const notes=node('section','rq-fees-conditions');
  notes.append(node('h2','',t.noteTitle));
  const list=node('ul');t.rules.forEach(rule=>list.append(node('li','',rule)));
  notes.append(list,node('p','rq-fees-legal',t.note));
  root.append(notes);
  const action=node('div','rq-fees-actions');
  const contact=node('a','rq-fees-contact',t.inquiry);
  contact.href='mailto:info@roboquo.com?subject='+encodeURIComponent('RoboQuo Transaction Support Inquiry');
  const back=node('a','rq-fees-back',t.back);back.href='#about';
  back.addEventListener('click',ev=>{ev.preventDefault();if(typeof route==='function')route('about')});
  action.append(contact,back);root.append(action);
 }
 function init(){
  if(!$('rqFeesMount'))return;
  render();
  document.addEventListener('rq:languagechange',render);
  $('languageSelect')?.addEventListener('change',render);
  document.querySelectorAll('[data-rq-fees-link]').forEach(el=>el.addEventListener('click',e=>{
   e.preventDefault();if(typeof route==='function')route('fees');else location.hash='fees';
  }));
 }
 window.RQ_FEE_RATES=RATES; // Read-only public tariff for QA and calculators.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();