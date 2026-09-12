/* RoboQuo v24 — commerce-first layer */
(() => {
  const V24 = {
    en:{buy:'Buy',sell:'Sell',categories:'Categories',services:'Services',companies:'Companies',events:'Events',cart:'Cart',heroTitle:'Robots.<br><span>Ready to trade.</span>',heroLead:'Buy and sell robots, EOAT, vision and automation equipment worldwide.',heroBody:'Search robots with clear prices and seller information, or sell your own machine through a guided listing flow.',heroSearch:'Search FANUC, Yaskawa, CRX, GP12, gripper, vision...',heroPrimary:'Buy Robots',heroSecondary:'Sell a Robot',trust1:'Browse before you join',trust2:'Buy now or make an offer',trust3:'Card, transfer or invoice',trust4:'Global sellers and service partners',buyCardTitle:'Buy robots and automation equipment',buyCardBody:'Search fixed-price listings, compare trusted sellers and move from discovery to checkout in one simple flow.',sellCardTitle:'Sell your robot globally',sellCardBody:'Use the guided wizard to photograph, describe and publish industrial robots, cobots, peripherals and spare parts.',solutionTitle:'Build a complete solution',solutionBody:'Start with a robot, then add grippers, vision, integration, inspection and logistics.',whyTitle:'Why buyers will use RoboQuo',why1:'Clear product cards with pricing, condition and seller context.',why2:'Buy now for fixed-price items, or make a private offer.',why3:'One place for robots, peripherals, services and logistics.',why4:'Open browsing, then account creation only when needed.',featuredTitle:'Featured products ready to buy',featuredLink:'View market →',servicesTitle:'More than a marketplace',servicesBody:'RoboQuo can connect the robot, peripheral, inspection, integration and logistics flow around one purchase.',wizardTitle:'Sell your robot in a guided flow',wizardBody:'Ask sellers to upload the robot, nameplate, controller, cables, accessories, operating hours, errors and shipping condition without forcing them to start over.',marketNoticeTitle:'Designed for real transactions',marketNoticeBody:'Fixed-price items can be added to the cart. Negotiated items can receive a private offer. Sellers and buyers handle the final commercial responsibility, while RoboQuo acts as a matching and transaction layer.',detailCondition:'Condition',detailSeller:'Seller',detailLocation:'Location',detailPayment:'Payments',detailShipping:'Shipping',detailHours:'Operating Hours',addToCart:'Add to Cart',buyNow:'Buy Now',makeOffer:'Make Offer',askSeller:'Ask Seller',verifiedSeller:'Verified Seller',nameplate:'Nameplate uploaded',video:'Operation video',cartTitle:'Your Cart',continueShopping:'Continue Shopping',subtotal:'Subtotal',serviceFee:'Platform fee',shipping:'Shipping',toBeCalculated:'To be calculated',checkout:'Continue to Checkout',requestInvoice:'Request Invoice / PO',secure:'Secure checkout options',emptyCart:'Your cart is empty.',emptyCartBody:'Add fixed-price robots or peripherals to start the checkout flow. Private-offer listings can still be negotiated directly with the seller.',goToMarket:'Go to Market',checkoutTitle:'Checkout preview',checkoutBody:'Choose the payment flow that matches the transaction: card, bank transfer, invoice/PO, or deposit + balance. In the live service, these options can connect to payment and escrow partners.',added:'Added to cart',removed:'Removed from cart',dealers:'Dealers & service',eventsNow:'Events & market info',collabTitle:'Build the robotics ecosystem with RoboQuo',collabBody:'Manufacturers, dealers, system integrators, service providers, logistics companies and technology partners can contact RoboQuo to discuss listings, distribution, integration, events, data partnerships and other collaboration opportunities.',collabBtn:'Partnership & Collaboration',salesBtn:'Sales & Trading',generalBtn:'General Inquiry',collabMail:'partnerships@roboquo.com',salesMail:'sales@roboquo.com',infoMail:'info@roboquo.com',collabNote:'Tell us your company, country, product or service, and what kind of collaboration you are looking for.'},
    ja:{buy:'購入',sell:'販売',categories:'カテゴリー',services:'サービス',companies:'企業',events:'展示会',cart:'カート',heroTitle:'Robots.<br><span>Ready to trade.</span>',heroLead:'ロボット、EOAT、ビジョン、自動化機器を世界中から購入・販売。',heroBody:'価格や販売者情報が見える商品を探し、必要に応じてそのまま購入、または自社設備をガイド付きで出品できます。',heroSearch:'FANUC、Yaskawa、CRX、GP12、グリッパー、ビジョン…',heroPrimary:'ロボットを購入',heroSecondary:'ロボットを販売',trust1:'閲覧は自由',trust2:'今すぐ購入 / 価格提案',trust3:'カード・振込・請求書に対応',trust4:'世界の販売会社とサービス会社',buyCardTitle:'ロボット・自動化機器を購入',buyCardBody:'固定価格商品を比較し、販売会社を確認し、そのまま購入フローへ進めます。',sellCardTitle:'ロボットを世界へ販売',sellCardBody:'産業用ロボット、協働ロボット、周辺機器、部品をガイド付きで出品できます。',solutionTitle:'導入ソリューションをまとめて構成',solutionBody:'ロボットに加えて、グリッパー、ビジョン、SI、検査、物流まで一つの流れで。',whyTitle:'RoboQuoが使いやすい理由',why1:'価格・状態・販売者情報が見やすい商品カード。',why2:'固定価格はそのまま購入、交渉品は非公開オファー。',why3:'ロボットだけでなく周辺機器・サービス・物流も接続。',why4:'まずは自由に閲覧し、必要な時だけ登録。',featuredTitle:'今すぐ購入できる注目商品',featuredLink:'マーケットを見る →',servicesTitle:'マーケットプレイス以上の価値',servicesBody:'RoboQuoはロボットに加えて周辺機器、検査、SI、物流まで購入フローに接続できます。',wizardTitle:'ガイド付きで簡単に出品',wizardBody:'ロボット本体、銘板、コントローラ、ケーブル、付属品、稼働時間、エラー有無、発送状態まで、売り手が途中で迷わない流れで登録できます。',marketNoticeTitle:'実取引を意識した設計',marketNoticeBody:'固定価格商品はカートへ追加、交渉商品は非公開オファーが可能です。最終的な商取引責任は売り手・買い手が持ち、RoboQuoはマッチングと取引フローを支援します。',detailCondition:'状態',detailSeller:'販売者',detailLocation:'所在地',detailPayment:'決済',detailShipping:'配送',detailHours:'稼働時間',addToCart:'カートに追加',buyNow:'今すぐ購入',makeOffer:'価格を提案',askSeller:'販売者に問い合わせ',verifiedSeller:'確認済み販売者',nameplate:'銘板写真あり',video:'動作動画あり',cartTitle:'カート',continueShopping:'買い物を続ける',subtotal:'小計',serviceFee:'プラットフォーム手数料',shipping:'送料',toBeCalculated:'別途計算',checkout:'チェックアウトへ進む',requestInvoice:'請求書 / POを依頼',secure:'安全な決済オプション',emptyCart:'カートは空です。',emptyCartBody:'固定価格の商品を追加するとチェックアウトに進めます。交渉型商品は販売者へ直接オファーできます。',goToMarket:'マーケットへ',checkoutTitle:'チェックアウトのイメージ',checkoutBody:'カード、銀行振込、請求書 / PO、前金＋残金など取引規模に応じた決済方法を選べます。',added:'カートに追加しました',removed:'カートから削除しました',dealers:'代理店・サービス',eventsNow:'展示会・市場情報',collabTitle:'RoboQuoとロボットエコシステムをつなぐ',collabBody:'ロボットメーカー、販売会社、商社、SI、サービス会社、物流会社、テクノロジーパートナーからの掲載、販売連携、導入支援、イベント、データ連携、その他の協業に関するご相談を受け付けています。',collabBtn:'パートナーシップ・協業',salesBtn:'販売・取引に関するお問い合わせ',generalBtn:'一般お問い合わせ',collabMail:'partnerships@roboquo.com',salesMail:'sales@roboquo.com',infoMail:'info@roboquo.com',collabNote:'会社名、国・地域、製品・サービス、希望する協業内容をご連絡ください。'},
    ko:{buy:'구매',sell:'판매',categories:'카테고리',services:'서비스',companies:'업체',events:'이벤트',cart:'장바구니',heroTitle:'Robots.<br><span>Ready to trade.</span>',heroLead:'로봇, EOAT, 비전, 자동화 장비를 전세계에서 사고팔 수 있습니다.',heroBody:'가격과 판매자 정보가 보이는 상품을 찾고, 바로 구매하거나 가이드 형식으로 직접 판매 등록을 진행할 수 있습니다.',heroSearch:'FANUC, Yaskawa, CRX, GP12, 그리퍼, 비전...',heroPrimary:'로봇 구매',heroSecondary:'로봇 판매',trust1:'가입 없이 먼저 둘러보기',trust2:'바로 구매 또는 가격 제안',trust3:'카드·송금·인보이스 대응',trust4:'글로벌 판매자와 서비스업체',buyCardTitle:'로봇과 자동화 장비 구매',buyCardBody:'고정가 상품을 비교하고 판매자를 확인한 뒤 바로 체크아웃 흐름으로 진행합니다.',sellCardTitle:'로봇을 글로벌로 판매',sellCardBody:'산업용 로봇, 협동로봇, 주변기기, 부품까지 가이드 방식으로 등록할 수 있습니다.',solutionTitle:'솔루션 전체를 한 번에 구성',solutionBody:'로봇뿐 아니라 그리퍼, 비전, SI, 검사, 물류까지 한 흐름으로 연결합니다.',whyTitle:'구매자가 RoboQuo를 쓰는 이유',why1:'가격·상태·판매자 정보가 보이는 직관적 상품 카드.',why2:'고정가는 바로 구매, 협상형은 비공개 가격 제안.',why3:'로봇, 주변기기, 서비스, 물류를 한곳에서.',why4:'먼저 자유롭게 보고 필요할 때만 회원가입.',featuredTitle:'바로 구매 가능한 추천 상품',featuredLink:'마켓 보기 →',servicesTitle:'단순 마켓플레이스 이상',servicesBody:'RoboQuo는 로봇뿐 아니라 주변기기, 검사, SI, 물류까지 구매 흐름에 연결할 수 있습니다.',wizardTitle:'가이드 위저드로 간단하게 판매 등록',wizardBody:'로봇 본체, 명판, 컨트롤러, 케이블, 부속품, 사용 시간, 에러 여부, 배송 상태까지 중간에 끊김 없이 등록할 수 있습니다.',marketNoticeTitle:'실제 거래를 위한 구조',marketNoticeBody:'고정가 상품은 장바구니에 넣고, 협상형 상품은 비공개 가격 제안을 보낼 수 있습니다. 최종 상거래 책임은 판매자와 구매자가 지며, RoboQuo는 매칭과 거래 흐름을 지원합니다.',detailCondition:'상태',detailSeller:'판매자',detailLocation:'지역',detailPayment:'결제',detailShipping:'배송',detailHours:'사용시간',addToCart:'장바구니 추가',buyNow:'바로 구매',makeOffer:'가격 제안',askSeller:'판매자 문의',verifiedSeller:'검증된 판매자',nameplate:'명판 사진',video:'동작 영상',cartTitle:'장바구니',continueShopping:'계속 쇼핑하기',subtotal:'상품 합계',serviceFee:'플랫폼 수수료',shipping:'배송비',toBeCalculated:'별도 계산',checkout:'체크아웃 진행',requestInvoice:'인보이스 / PO 요청',secure:'안전한 결제 옵션',emptyCart:'장바구니가 비어 있습니다.',emptyCartBody:'고정가 상품을 추가하면 체크아웃 흐름을 시작할 수 있습니다. 협상형 상품은 판매자와 직접 조건 협의가 가능합니다.',goToMarket:'마켓으로 가기',checkoutTitle:'체크아웃 미리보기',checkoutBody:'거래 규모에 맞춰 카드, 은행송금, 인보이스/PO, 선금+잔금 방식 등을 선택할 수 있습니다.',added:'장바구니에 추가했습니다',removed:'장바구니에서 제거했습니다',dealers:'대리점·서비스',eventsNow:'이벤트·시장정보',collabTitle:'RoboQuo와 함께 로봇 생태계를 연결하세요',collabBody:'로봇 메이커, 판매사, 상사, SI, 서비스업체, 물류회사, 기술 파트너의 상품 등록, 판매 연계, 도입 지원, 이벤트, 데이터 제휴 및 기타 협업 문의를 받고 있습니다.',collabBtn:'파트너십·협업 문의',salesBtn:'구매·판매 문의',generalBtn:'일반 문의',collabMail:'partnerships@roboquo.com',salesMail:'sales@roboquo.com',infoMail:'info@roboquo.com',collabNote:'회사명, 국가/지역, 제품 또는 서비스, 희망하는 협업 내용을 함께 보내주세요.'}
  };
  const FALLBACK='en';
  const STORAGE='rqCartV24';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const lang=()=>document.documentElement.lang||'en';
  const tx=(k)=>((V24[lang()]||V24[FALLBACK])[k]||V24[FALLBACK][k]||k);
  const all = () => (typeof allRobotListings === 'function' ? allRobotListings() : (typeof listings !== 'undefined' ? [...listings,...JSON.parse(localStorage.getItem('rqListings')||'[]')] : []));
  const idOf = (r) => String(r.id || [r.brand,r.model,r.year,r.location].join('|'));
  const findListing = (id) => all().find(r => idOf(r)===String(id));
  const cart = () => JSON.parse(localStorage.getItem(STORAGE)||'[]');
  const saveCart = (items) => { localStorage.setItem(STORAGE, JSON.stringify(items)); updateCartCount(); renderCartPage(); };
  const inCart = (id) => cart().includes(String(id));
  function formatPrice(r){ return (typeof yen==='function' && r.price) ? yen(r.price) : ((r.price||0).toLocaleString ? '¥'+Number(r.price||0).toLocaleString() : 'Check seller'); }
  function saleLabel(r){ const fixed = r.sale !== 'bid'; return fixed ? (typeof tr==='function'?tr('fixedPrice'):'Fixed Price') : (typeof tr==='function'?tr('bidding'):'Private Offers'); }
  function initials(s){ return String(s||'R').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase(); }
  function robotSvg(r, variant='main'){
    const colors=['#f5b301','#2848ff','#10b981','#ef4444','#8b5cf6','#0ea5e9'];
    const idx=Math.abs((String(r.brand||'').charCodeAt(0)+String(r.model||'').charCodeAt(0)))%colors.length;
    const c=colors[idx];
    const scale=variant==='thumb'?0.75:1;
    return `<svg viewBox="0 0 320 220" width="100%" height="100%" aria-hidden="true">
      <defs><linearGradient id="bg-${initials(r.brand)}" x1="0" x2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eef2f7"/></linearGradient></defs>
      <rect width="320" height="220" rx="24" fill="url(#bg-${initials(r.brand)})"/>
      <text x="20" y="28" font-size="12" font-family="Arial" font-weight="700" fill="#475467">${(r.brand||'Robot').toUpperCase()}</text>
      <ellipse cx="168" cy="184" rx="92" ry="18" fill="#cfd8e3" opacity=".7"/>
      <g transform="translate(45 20) scale(${scale})">
        <rect x="88" y="136" width="84" height="38" rx="14" fill="${c}"/>
        <circle cx="132" cy="126" r="30" fill="${c}" stroke="#d69e09" stroke-width="7" opacity=".95"/>
        <rect x="118" y="60" width="28" height="70" rx="12" fill="${c}" transform="rotate(-16 132 96)"/>
        <circle cx="101" cy="60" r="24" fill="${c}" opacity=".95"/>
        <rect x="100" y="52" width="102" height="22" rx="11" fill="${c}" transform="rotate(9 151 63)"/>
        <circle cx="200" cy="76" r="20" fill="${c}" opacity=".95"/>
        <rect x="197" y="73" width="55" height="18" rx="8" fill="${c}" transform="rotate(34 224 82)"/>
        <rect x="236" y="95" width="28" height="46" rx="8" fill="#111827" transform="rotate(34 250 118)"/>
      </g>
      <rect x="18" y="176" width="108" height="24" rx="12" fill="#ffffff"/>
      <text x="72" y="192" text-anchor="middle" font-size="11" font-family="Arial" font-weight="700" fill="#111827">${initials(r.brand)} ${String(r.model||'').slice(0,10)}</text>
    </svg>`;
  }

  function navLabel(route){
    const map={robots:tx('buy'),categories:tx('categories'),projects:tx('services'),companies:tx('companies'),events:tx('events'),about:'About'};
    return map[route]||route;
  }

  function ensureCartButton(){
    if($('.cart-btn')) return;
    const btn=document.createElement('button');
    btn.className='cart-btn';
    btn.innerHTML=`🛒 <span>${tx('cart')}</span> <span class="cart-count">0</span>`;
    btn.addEventListener('click',()=>route('cart'));
    $('.header-actions')?.insertBefore(btn,$('.header-actions').firstElementChild);
  }

  function patchNav(){
    const nav=$('.desktop-nav');
    if(nav){
      nav.innerHTML=`
        <a data-route="robots" href="#robots">${navLabel('robots')}</a>
        <a data-route="categories" href="#categories">${navLabel('categories')}</a>
        <a data-route="projects" href="#projects">${navLabel('projects')}</a>
        <a data-route="companies" href="#companies">${navLabel('companies')}</a>
        <a data-route="events" href="#events">${navLabel('events')}</a>
        <a data-route="about" href="#about">About</a>`;
      $$('[data-route]',nav).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();route(a.dataset.route)}));
    }
    const mobile=$('.mobile-nav');
    if(mobile){
      mobile.innerHTML=`
        <button data-route="home"><span>⌂</span><small>Home</small></button>
        <button data-route="robots"><span>⌕</span><small>${tx('buy')}</small></button>
        <button class="sell-mobile" data-action="sell"><span>＋</span><small>${tx('sell')}</small></button>
        <button data-route="cart"><span>🛒</span><small>${tx('cart')}</small></button>
        <button data-route="events"><span>◷</span><small>${tx('events')}</small></button>`;
      $$('[data-route]',mobile).forEach(a=>a.addEventListener('click',()=>route(a.dataset.route)));
      $('[data-action="sell"]',mobile)?.addEventListener('click',()=>window.rqStartSell?window.rqStartSell(): (typeof sellFlow==='function'&&sellFlow()));
    }
  }

  function patchHero(){
    const title=$('#home .hero-copy h1'); if(title) title.innerHTML=tx('heroTitle');
    const lead=$('#home .local-headline'); if(lead) lead.textContent=tx('heroLead');
    const body=$('#home .hero-desc'); if(body) body.textContent=tx('heroBody');
    const input=$('#globalSearch'); if(input) input.placeholder=tx('heroSearch');
    const primary=$('#home .hero-actions .primary'); if(primary){primary.textContent=tx('heroPrimary'); primary.onclick=()=>route('robots');}
    const secondary=$('#home .hero-actions .secondary'); if(secondary){secondary.textContent=tx('heroSecondary'); secondary.onclick=()=>window.rqStartSell?window.rqStartSell(): (typeof sellFlow==='function'&&sellFlow());}
    if(!$('#home .hero-trust')){
      $('.hero-copy .hero-actions')?.insertAdjacentHTML('afterend',`<div class="hero-trust"><span>✓ ${tx('trust1')}</span><span>✓ ${tx('trust2')}</span><span>✓ ${tx('trust3')}</span><span>✓ ${tx('trust4')}</span></div>`);
    } else {
      $('#home .hero-trust').innerHTML=`<span>✓ ${tx('trust1')}</span><span>✓ ${tx('trust2')}</span><span>✓ ${tx('trust3')}</span><span>✓ ${tx('trust4')}</span>`;
    }
  }

  function injectCommerceSections(){
    const home=$('#home'); if(!home) return;
    const existing=$('#v24CommerceBlock'); if(existing) existing.remove();
    if(!$('#v24CommerceBlock')){
      const block=document.createElement('div');
      block.id='v24CommerceBlock';
      block.innerHTML=`
        <section class="v24-quick-commerce">
          <div class="v24-card-grid">
            <article class="v24-action-card">
              <span class="eyebrow">BUY</span>
              <h3>${tx('buyCardTitle')}</h3>
              <p>${tx('buyCardBody')}</p>
              <button class="primary" data-route="robots">${tx('heroPrimary')}</button>
              <div class="v24-metric-row"><span>${tx('verifiedSeller')}</span><span>${tx('cart')}</span><span>${tx('makeOffer')}</span></div>
            </article>
            <article class="v24-action-card">
              <span class="eyebrow">SELL</span>
              <h3>${tx('sellCardTitle')}</h3>
              <p>${tx('sellCardBody')}</p>
              <button class="secondary" data-action="sell">${tx('heroSecondary')}</button>
              <div class="v24-metric-row"><span>${tx('nameplate')}</span><span>${tx('detailHours')}</span><span>${tx('detailShipping')}</span></div>
            </article>
            <article class="v24-action-card">
              <span class="eyebrow">SOLUTION</span>
              <h3>${tx('solutionTitle')}</h3>
              <p>${tx('solutionBody')}</p>
              <button class="secondary" data-route="projects">${tx('services')}</button>
              <div class="v24-metric-row"><span>Robot</span><span>EOAT</span><span>Vision</span><span>Logistics</span></div>
            </article>
            <article class="v24-action-card">
              <span class="eyebrow">NETWORK</span>
              <h3>${tx('dealers')}</h3>
              <p>${tx('eventsNow')}</p>
              <button class="secondary" data-route="companies">${tx('companies')}</button>
              <div class="v24-metric-row"><span>${tx('events')}</span><span>${tx('companies')}</span><span>Manufacturers</span></div>
            </article>
          </div>
        </section>
        <section class="v24-highlight-strip">
          <article class="v24-highlight-item"><strong>${tx('why1')}</strong><p>${tx('marketNoticeBody')}</p></article>
          <article class="v24-highlight-item"><strong>${tx('why2')}</strong><p>${tx('buyCardBody')}</p></article>
          <article class="v24-highlight-item"><strong>${tx('why3')}</strong><p>${tx('servicesBody')}</p></article>
          <article class="v24-highlight-item"><strong>${tx('why4')}</strong><p>${tx('wizardBody')}</p></article>
        </section>
        <section class="wrap section-block v24-products-section">
          <div class="section-title-row"><div><div class="kicker">BUY NOW</div><h2>${tx('featuredTitle')}</h2></div><button class="link-btn" data-route="robots">${tx('featuredLink')}</button></div>
          <div class="v24-products-grid" id="featuredCommerceGrid"></div>
        </section>
        <section class="wrap section-block v24-services-section">
          <div class="section-title-row"><div><div class="kicker">SERVICES</div><h2>${tx('servicesTitle')}</h2><p>${tx('servicesBody')}</p></div></div>
          <div class="v24-services-board">
            <article class="v24-panel">
              <h3>${tx('whyTitle')}</h3>
              <div class="v24-list">
                <div><span>01</span><span><strong>${tx('why1')}</strong>${tx('buyCardBody')}</span></div>
                <div><span>02</span><span><strong>${tx('why2')}</strong>${tx('marketNoticeBody')}</span></div>
                <div><span>03</span><span><strong>${tx('why3')}</strong>${tx('solutionBody')}</span></div>
                <div><span>04</span><span><strong>${tx('why4')}</strong>${tx('wizardBody')}</span></div>
              </div>
            </article>
            <article class="v24-panel">
              <h3>${tx('wizardTitle')}</h3>
              <p>${tx('wizardBody')}</p>
              <div class="v24-list">
                <div><span>📷</span><span><strong>Robot body photos</strong>Nameplate, arm, base, cabinet, teach pendant, cables and accessories.</span></div>
                <div><span>🧾</span><span><strong>Condition checklist</strong>Year, payload, operating hours, error history and current running status.</span></div>
                <div><span>🚚</span><span><strong>Shipping readiness</strong>Pallet, crate, dismantling support and export packing options.</span></div>
                <div><span>🤝</span><span><strong>Commercial options</strong>Buy now, private offer, inspection request and logistics support.</span></div>
              </div>
            </article>
          </div>
        </section>
        <section class="v24-sell-banner">
          <div>
            <div class="kicker">SELL GLOBALLY</div>
            <h2>${tx('wizardTitle')}</h2>
            <p>${tx('wizardBody')}</p>
            <div class="hero-actions" style="margin-top:18px"><button class="primary big" data-action="sell">${tx('heroSecondary')}</button><button class="secondary big" data-route="companies">${tx('companies')}</button></div>
          </div>
          <div class="v24-sell-checks">
            <span>✓ ${tx('nameplate')}</span>
            <span>✓ ${tx('video')}</span>
            <span>✓ ${tx('detailHours')}</span>
            <span>✓ ${tx('detailShipping')}</span>
            <span>✓ ${tx('verifiedSeller')}</span>
            <span>✓ ${tx('makeOffer')}</span>
          </div>
        </section>
        <section class="v24-collab-section">
          <div class="v24-collab-copy">
            <div class="kicker">PARTNERSHIPS & COLLABORATION</div>
            <h2>${tx('collabTitle')}</h2>
            <p>${tx('collabBody')}</p>
            <small>${tx('collabNote')}</small>
          </div>
          <div class="v24-contact-grid">
            <a class="v24-contact-card primary-card" href="mailto:${tx('collabMail')}?subject=RoboQuo%20Partnership%20%26%20Collaboration">
              <span>PARTNERSHIP</span><strong>${tx('collabBtn')}</strong><b>${tx('collabMail')} →</b>
            </a>
            <a class="v24-contact-card" href="mailto:${tx('salesMail')}?subject=RoboQuo%20Sales%20Inquiry">
              <span>SALES</span><strong>${tx('salesBtn')}</strong><b>${tx('salesMail')} →</b>
            </a>
            <a class="v24-contact-card" href="mailto:${tx('infoMail')}?subject=RoboQuo%20General%20Inquiry">
              <span>CONTACT</span><strong>${tx('generalBtn')}</strong><b>${tx('infoMail')} →</b>
            </a>
          </div>
        </section>
      `;
      const principle=$('#home .principle-bar');
      principle?.insertAdjacentElement('afterend',block);
    }
    // Refresh text inside existing injected block
    $('#v24CommerceBlock .v24-products-section h2')?.replaceChildren(document.createTextNode(tx('featuredTitle')));
    const featuredLink=$('#v24CommerceBlock .v24-products-section .link-btn'); if(featuredLink) featuredLink.textContent=tx('featuredLink');
    $$('#v24CommerceBlock [data-route]').forEach(el=>el.onclick=()=>route(el.dataset.route));
    $$('#v24CommerceBlock [data-action="sell"]').forEach(el=>el.onclick=()=>window.rqStartSell?window.rqStartSell(): (typeof sellFlow==='function'&&sellFlow()));
  }


  function ensureFooter(){
    document.querySelector('.v24-site-footer')?.remove();
    const footer=document.createElement('footer');
    footer.className='v24-site-footer';
    footer.innerHTML=`<div class="v24-footer-inner"><div><div class="v24-footer-brand">RoboQuo</div><p>${tx('collabBody')}</p></div><div class="v24-footer-contacts"><a href="mailto:${tx('salesMail')}?subject=RoboQuo%20Sales%20Inquiry">${tx('salesBtn')} · ${tx('salesMail')}</a><a href="mailto:${tx('collabMail')}?subject=RoboQuo%20Partnership%20%26%20Collaboration">${tx('collabBtn')} · ${tx('collabMail')}</a><a href="mailto:${tx('infoMail')}?subject=RoboQuo%20General%20Inquiry">${tx('generalBtn')} · ${tx('infoMail')}</a></div></div><div class="v24-footer-bottom"><span>© 2026 RoboQuo</span><span>roboquo.com</span></div>`;
    document.body.insertBefore(footer, document.getElementById('modalBackdrop'));
  }

  function patchRobotsPage(){
    const head=$('#robots .page-head h1'); if(head) head.textContent='Buy Robots';
    const desc=$('#robots .page-head p'); if(desc) desc.textContent='Search fixed-price and private-offer listings. Add fixed-price items to the cart, or negotiate directly with the seller.';
    if(!$('#robots .v24-market-note')){
      const note=document.createElement('div');
      note.className='v24-market-note';
      note.innerHTML=`<div><strong>${tx('marketNoticeTitle')}</strong><p>${tx('marketNoticeBody')}</p></div><button class="secondary" data-action="sell">${tx('heroSecondary')}</button>`;
      $('#robots .market-toolbar')?.insertAdjacentElement('afterend', note);
      $('[data-action="sell"]', note)?.addEventListener('click',()=>window.rqStartSell?window.rqStartSell(): (typeof sellFlow==='function'&&sellFlow()));
    }
  }

  function renderCard(r){
    const id=idOf(r), fixed=r.sale!=='bid';
    const meta=[r.year, r.payload, r.location].filter(Boolean).slice(0,3).map(x=>`<span>${x}</span>`).join('');
    const tags=[r.cat, ...(r.apps||[])].filter(Boolean).slice(0,3).map(x=>`<span>${x}</span>`).join('');
    return `<article class="v24-listing-card">
      <div class="v24-photo" onclick="rqOpenProduct('${id.replace(/'/g,"\\'")}')">
        <div class="photo-badges"><span class="v24-badge">${r.country||'Global'}</span><span class="v24-badge dark">${saleLabel(r)}</span></div>
        ${robotSvg(r)}
      </div>
      <div class="v24-card-body">
        <div class="v24-card-top">
          <div>
            <h3 class="v24-card-title" onclick="rqOpenProduct('${id.replace(/'/g,"\\'")}')">${r.brand} ${r.model}</h3>
            <div class="v24-card-sub">${[r.location,r.country].filter(Boolean).join(' · ')}</div>
          </div>
          <div class="v24-card-price"><strong>${formatPrice(r)}</strong><small>${fixed?'Buy now eligible':'Private offer flow'}</small></div>
        </div>
        <div class="v24-trust-row"><span>${tx('verifiedSeller')}</span><span>${tx('nameplate')}</span>${fixed?`<span>${tx('video')}</span>`:''}</div>
        <div class="v24-meta-row">${meta || '<span>Used Robot</span>'}</div>
        <div class="v24-card-tags">${tags || '<span>Industrial robot</span>'}</div>
        <div class="v24-actions">
          <button class="ghost" onclick="openAuth('inquiry','${(r.brand+' '+r.model).replace(/'/g,"\\'")}')">${tx('askSeller')}</button>
          <button class="buy" onclick="${fixed?`rqBuyNow('${id.replace(/'/g,"\\'")}')`:`openAuth('bid','${(r.brand+' '+r.model).replace(/'/g,"\\'")}')`}">${fixed?tx('buyNow'):tx('makeOffer')}</button>
          <button class="cart" onclick="${fixed?`rqAddToCart('${id.replace(/'/g,"\\'")}')`:`rqOpenProduct('${id.replace(/'/g,"\\'")}')`}">${fixed?tx('addToCart'):tx('makeOffer')}</button>
        </div>
      </div>
    </article>`;
  }

  function renderListingsV24(){
    const search = ($('#marketSearch')?.value||'').toLowerCase();
    const cat = $('#categoryFilter')?.value||'';
    const app = $('#applicationFilter')?.value||'';
    const country = $('#countryFilter')?.value||'';
    const sale = $('#saleFilter')?.value||'';
    const items = all().filter(r => (!search || `${r.brand} ${r.model} ${r.location} ${r.country}`.toLowerCase().includes(search)) && (!cat || r.cat===cat) && (!app || (r.apps||[]).includes(app)) && (!country || r.country===country) && (!sale || r.sale===sale));
    const market=$('#marketListings'); if(market) market.innerHTML = items.map(renderCard).join('') || '<p>No results.</p>';
    const home=$('#homeListings'); if(home) home.innerHTML = all().slice(0,3).map(renderCard).join('');
    const featured=$('#featuredCommerceGrid'); if(featured) featured.innerHTML = all().filter(r=>r.sale!=='bid').slice(0,4).map(renderCard).join('');
  }

  function detailHtml(r){
    const fixed=r.sale!=='bid';
    const title=`${r.brand} ${r.model}`;
    return `<div class="kicker">ROBOQUO PRODUCT</div>
      <div class="v24-product-layout">
        <div class="v24-gallery">
          <div class="v24-main-image" id="v24MainImage">${robotSvg(r,'main')}</div>
          <div class="v24-thumb-row">
            <div class="v24-thumb" data-view="robot">${robotSvg(r,'thumb')}</div>
            <div class="v24-thumb" data-view="nameplate"><div style="background:#fff;border:1px solid #d0d5dd;border-radius:12px;padding:10px 14px;text-align:center;font-size:12px;font-weight:800">NAMEPLATE<br/><small>${r.brand} / ${r.model}</small></div></div>
            <div class="v24-thumb" data-view="controller"><div style="background:#1f2937;color:#fff;border-radius:12px;padding:12px 14px;text-align:center;font-size:11px;font-weight:800">CONTROLLER<br/><small>YRC / R-30iB / Cabinet</small></div></div>
            <div class="v24-thumb" data-view="accessories"><div style="background:#eef2ff;border-radius:12px;padding:12px 14px;text-align:center;font-size:11px;font-weight:800">ACCESSORIES<br/><small>Teach pendant, cables, options</small></div></div>
          </div>
        </div>
        <div>
          <div class="v24-detail-head"><h2>${title}</h2><p>${[r.location,r.country].filter(Boolean).join(' · ')} · ${saleLabel(r)}</p></div>
          <div class="v24-price-panel"><div><small style="display:block;color:#667085;margin-bottom:6px">${fixed?'Fixed price listing':'Negotiated listing'}</small><strong>${formatPrice(r)}</strong></div><div class="v24-trust-row"><span>${tx('verifiedSeller')}</span><span>${tx('nameplate')}</span><span>${tx('video')}</span></div></div>
          <div class="v24-spec-grid">
            <div><small>${tx('detailCondition')}</small><strong>Used · Production line</strong></div>
            <div><small>${tx('detailSeller')}</small><strong>Verified company seller</strong></div>
            <div><small>${tx('detailLocation')}</small><strong>${[r.location,r.country].filter(Boolean).join(' · ')}</strong></div>
            <div><small>${tx('detailHours')}</small><strong>${r.hours || '4,820 h'}</strong></div>
            <div><small>${tx('detailPayment')}</small><strong>Card / Transfer / Invoice</strong></div>
            <div><small>${tx('detailShipping')}</small><strong>Pallet / Crate / Export support</strong></div>
          </div>
          <div class="v24-note-box">This prototype shows the commerce flow. In the live service, buyers and sellers can add inspection, dismantling, export packing, logistics and payment terms as optional services.</div>
          <div class="v24-modal-actions">
            <button class="secondary" onclick="openAuth('inquiry','${title.replace(/'/g,"\\'")}')">${tx('askSeller')}</button>
            <button class="primary" onclick="${fixed?`rqBuyNow('${idOf(r).replace(/'/g,"\\'")}')`:`openAuth('bid','${title.replace(/'/g,"\\'")}')`}">${fixed?tx('buyNow'):tx('makeOffer')}</button>
            <button class="blue" onclick="${fixed?`rqAddToCart('${idOf(r).replace(/'/g,"\\'")}')`:`openAuth('bid','${title.replace(/'/g,"\\'")}')`}">${fixed?tx('addToCart'):tx('makeOffer')}</button>
          </div>
        </div>
      </div>`;
  }

  window.rqOpenProduct = (id) => {
    const r=findListing(id); if(!r) return;
    openModal(detailHtml(r));
    const modal=$('#modal'); if(modal) modal.classList.add('v24-product-modal');
    $$('.v24-thumb').forEach(thumb=>thumb.addEventListener('click',()=>{
      const v=thumb.dataset.view; const mount=$('#v24MainImage'); if(!mount) return;
      if(v==='robot') mount.innerHTML=robotSvg(r,'main');
      if(v==='nameplate') mount.innerHTML=`<div style="background:#fff;border:1px solid #d0d5dd;border-radius:18px;padding:20px 22px;text-align:left;width:min(320px,90%)"><div style="font-size:12px;color:#667085">Robot Nameplate</div><div style="font-size:24px;font-weight:900;margin-top:8px">${r.brand}</div><div style="font-size:18px;font-weight:700">${r.model}</div><div style="margin-top:14px;font-size:12px;color:#475467">Year ${r.year||'2022'} · Payload ${r.payload||'N/A'} · S/N demo</div></div>`;
      if(v==='controller') mount.innerHTML=`<div style="background:#111827;color:#fff;border-radius:22px;padding:28px;width:min(340px,92%)"><div style="font-size:12px;color:#cbd5e1">Controller</div><div style="font-size:30px;font-weight:900;margin:12px 0">Cabinet</div><div style="font-size:13px;line-height:1.65;color:#e2e8f0">Teach pendant, main power, internal panel and cables can be shown here in the live listing.</div></div>`;
      if(v==='accessories') mount.innerHTML=`<div style="display:grid;gap:10px;width:min(340px,92%)"><div style="background:#eef2ff;border-radius:18px;padding:16px;font-weight:800">Teach pendant</div><div style="background:#ecfdf3;border-radius:18px;padding:16px;font-weight:800">Power / encoder cables</div><div style="background:#fff7ed;border-radius:18px;padding:16px;font-weight:800">Fixture / gripper / manuals</div></div>`;
    }));
  };

  window.rqAddToCart = (id) => {
    const item=findListing(id); if(!item || item.sale==='bid') return window.rqOpenProduct(id);
    const items=cart(); if(!items.includes(String(id))) items.push(String(id));
    saveCart(items); if(typeof toast==='function') toast(tx('added')); else alert(tx('added'));
  };
  window.rqRemoveFromCart = (id) => {
    saveCart(cart().filter(x=>x!==String(id))); if(typeof toast==='function') toast(tx('removed'));
  };
  window.rqBuyNow = (id) => { window.rqAddToCart(id); route('cart'); };
  window.rqCheckoutPreview = () => {
    openModal(`<div class="kicker">ROBOQUO CHECKOUT</div><h2>${tx('checkoutTitle')}</h2><p>${tx('checkoutBody')}</p><div class="v24-payment-methods"><span>Credit Card</span><span>Bank Transfer</span><span>Invoice / PO</span><span>Deposit + Balance</span></div><div class="modal-actions" style="margin-top:18px"><button class="secondary" onclick="closeModal()">Close</button><button class="primary" onclick="closeModal();route('projects')">${tx('services')}</button></div>`);
  };

  function cartHtml(){
    const items=cart().map(findListing).filter(Boolean);
    if(!items.length) return `<div class="v24-empty-cart"><h2>${tx('emptyCart')}</h2><p>${tx('emptyCartBody')}</p><button class="primary" onclick="route('robots')">${tx('goToMarket')}</button></div>`;
    const subtotal=items.reduce((sum,r)=>sum+Number(r.price||0),0);
    const fee=Math.round(subtotal*0.02);
    return `<div class="v24-cart-layout">
      <div class="v24-cart-list">${items.map(r=>`<article class="v24-cart-item"><div class="v24-cart-item-photo">${robotSvg(r,'thumb')}</div><div><h3>${r.brand} ${r.model}</h3><p>${[r.location,r.country].filter(Boolean).join(' · ')}<br/>${r.year||''} ${r.payload?('· '+r.payload):''}<br/>${tx('verifiedSeller')} · ${tx('nameplate')} · ${tx('video')}</p><div class="v24-card-tags" style="margin-top:8px"><span>${saleLabel(r)}</span><span>${r.cat||'Robot'}</span></div></div><div><div class="price">${formatPrice(r)}</div><button class="card-btn" style="margin-top:14px" onclick="rqRemoveFromCart('${idOf(r).replace(/'/g,"\\'")}')">Remove</button></div></article>`).join('')}</div>
      <aside class="v24-cart-summary"><h3>${tx('cartTitle')}</h3><div class="v24-summary-rows"><div><span>${tx('subtotal')}</span><strong>${typeof yen==='function'?yen(subtotal):('¥'+subtotal.toLocaleString())}</strong></div><div><span>${tx('serviceFee')}</span><strong>${typeof yen==='function'?yen(fee):('¥'+fee.toLocaleString())}</strong></div><div><span>${tx('shipping')}</span><strong>${tx('toBeCalculated')}</strong></div><div class="total"><span>Total</span><strong>${typeof yen==='function'?yen(subtotal+fee):('¥'+(subtotal+fee).toLocaleString())} + shipping</strong></div></div><div class="v24-checkout-buttons"><button class="primary" onclick="rqCheckoutPreview()">${tx('checkout')}</button><button class="blue" onclick="rqCheckoutPreview()">${tx('requestInvoice')}</button><button onclick="route('robots')">${tx('continueShopping')}</button></div><div class="v24-payment-methods"><span>Credit Card</span><span>Bank Transfer</span><span>Invoice / PO</span><span>Deposit + Balance</span></div><div class="v24-note-box" style="margin-top:16px">${tx('marketNoticeBody')}</div></aside>
    </div>`;
  }
  function renderCartPage(){ const mount=$('#cartPageMount'); if(mount) mount.innerHTML=cartHtml(); }
  function updateCartCount(){ const count=String(cart().length); $$('.cart-count').forEach(el=>el.textContent=count); }

  function hookApplyLang(){
    if(typeof applyLang!=='function' || applyLang.__v24wrapped) return;
    const orig=applyLang;
    applyLang=function(l){ const res=orig(l); setTimeout(refresh,0); return res; };
    applyLang.__v24wrapped=true;
  }

  function refresh(){
    ensureCartButton(); patchNav(); patchHero(); injectCommerceSections(); patchRobotsPage(); ensureFooter(); updateCartCount(); renderListingsV24(); renderCartPage();
    const cartHead=$('#cart .page-head h1'); if(cartHead) cartHead.textContent=tx('cartTitle');
    const cartDesc=$('#cart .page-head p'); if(cartDesc) cartDesc.textContent='Buy fixed-price robots, peripherals and services with a simple checkout flow.';
    const cartBtn=$('#cart .page-head button'); if(cartBtn) cartBtn.textContent=tx('continueShopping');
  }

  function bindRoutes(){
    $$('.desktop-nav [data-route], .mobile-nav [data-route], .brand[data-route], [data-route]').forEach(el=>{
      if(el.dataset.v24bound) return; el.dataset.v24bound='1';
      el.addEventListener('click',e=>{ if(el.getAttribute('href')?.startsWith('#') || el.tagName==='BUTTON' || el.dataset.route){ e.preventDefault?.(); route(el.dataset.route); }});
    });
    $$('[data-action="sell"]').forEach(el=>{
      if(el.dataset.v24sell) return; el.dataset.v24sell='1';
      el.addEventListener('click',()=>window.rqStartSell?window.rqStartSell(): (typeof sellFlow==='function'&&sellFlow()));
    });
    ['marketSearch','categoryFilter','applicationFilter','countryFilter','saleFilter'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderListingsV24));
    ['categoryFilter','applicationFilter','countryFilter','saleFilter'].forEach(id=>document.getElementById(id)?.addEventListener('change',renderListingsV24));
  }

  function init(){
    hookApplyLang();
    try{ renderListings = renderListingsV24; listingCard = renderCard; }catch(e){}
    const baseClose = window.closeModal;
    if(baseClose && !window.__v24CloseWrapped){
      window.closeModal = function(){ document.getElementById('modal')?.classList.remove('v24-product-modal'); return baseClose(); };
      window.__v24CloseWrapped = true;
    }
    refresh();
    bindRoutes();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
