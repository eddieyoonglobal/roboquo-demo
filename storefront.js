(() => {
  'use strict';
  const copy = {
    en:{buy:'Buy',sell:'Sell',login:'Log in',account:'Account',market:'Robotics marketplace',headline1:'Industrial robots.',headline2:'Second life.',intro:'Buy and sell pre-owned robots, grippers and automation parts from around the world.',browse:'Browse equipment',list:'Sell equipment',brands:'Shop by manufacturer',category:'Shop by category',all:'View all equipment',arrivals:'New arrivals',featured:'Featured listings',empty:'No new listings yet. Published equipment will appear here.',emptyFeatured:'No featured equipment available yet.',guide:'For sellers',sellTitle:'Give your equipment a second life.',steps:'Choose your model, add photos and describe its condition. Set a price or invite private quotes from buyers.',equipment:'Equipment',robot:'Robots',gripper:'Grippers & EOAT',part:'Parts',controller:'Controllers',vision:'Vision',messages:'Messages',search:'Search brands, models, parts…',loading:'Loading equipment…',error:'Equipment listings are temporarily unavailable.',retry:'Try again'},
    ja:{buy:'購入',sell:'出品',login:'ログイン',account:'アカウント',market:'ロボットマーケットプレイス',headline1:'産業用ロボットに、',headline2:'次の活躍の場を。',intro:'世界各地の中古ロボット、グリッパー、自動化部品を売買できます。',browse:'商品を探す',list:'機器を出品',brands:'メーカーから探す',category:'カテゴリーから探す',all:'すべての商品',arrivals:'新着商品',featured:'注目の出品',empty:'新着商品はまだありません。公開された商品がここに表示されます。',emptyFeatured:'現在、注目の出品はありません。',guide:'出品ガイド',sellTitle:'お持ちの機器を次の現場へ。',steps:'モデルを選び、写真と状態を登録します。固定価格での販売、または購入希望者からの非公開見積もりを選べます。',equipment:'商品一覧',robot:'ロボット',gripper:'グリッパー・EOAT',part:'部品',controller:'コントローラー',vision:'ビジョン',messages:'メッセージ',search:'メーカー・モデル・部品を検索',loading:'商品を読み込み中…',error:'現在、商品情報を取得できません。',retry:'再試行'},
    ko:{buy:'구매',sell:'판매',login:'로그인',account:'내 계정',market:'로봇 마켓플레이스',headline1:'산업용 로봇의',headline2:'두 번째 시작.',intro:'전 세계 판매자가 등록한 중고 로봇과 그리퍼, 자동화 부품을 거래하세요.',browse:'매물 둘러보기',list:'장비 판매하기',brands:'제조사별로 찾기',category:'카테고리별로 찾기',all:'전체 매물 보기',arrivals:'최근 등록 매물',featured:'추천 매물',empty:'아직 등록된 매물이 없습니다. 판매자가 공개한 장비가 여기에 표시됩니다.',emptyFeatured:'아직 추천 매물이 없습니다.',guide:'판매 안내',sellTitle:'사용하던 장비에 새로운 일터를.',steps:'모델을 선택하고 실물 사진과 상태를 등록하세요. 고정가격으로 판매하거나 구매자에게 비공개 견적을 받을 수 있습니다.',equipment:'전체 매물',robot:'로봇',gripper:'그리퍼·EOAT',part:'부품',controller:'컨트롤러',vision:'비전',messages:'메시지',search:'제조사, 모델, 부품 검색',loading:'매물을 불러오는 중…',error:'현재 매물 정보를 불러올 수 없습니다.',retry:'다시 시도'}
  };
  const dictionary = () => copy[document.documentElement.lang] || copy.en;
  const byId = id => document.getElementById(id);
  window.rqStoreEmpty = key => {
    const state = window.rqPublishedState || 'loading';
    const label = state === 'ready' ? key : state;
    const retry = state === 'error' ? '<button data-retry>'+dictionary().retry+'</button>' : '';
    return '<div class="store-empty" role="status">'+dictionary()[label]+retry+'</div>';
  };
  function translate() {
    const t=dictionary();
    document.querySelectorAll('[data-ui]').forEach(el=>{
      const key=el.dataset.ui;
      el.textContent=t[key==='login' && window.rqAuthSession ? 'account' : key];
    });
    byId('globalSearch').placeholder=t.search;
    byId('globalSearch').setAttribute('aria-label',t.search);
    window.rqRenderMarketplace?.();
  }
  function browse(query='',category='') {
    route('robots');
    window.rqRenderMarketplace();
    byId('marketSearch').value=query;
    byId('categoryFilter').value=category;
    byId('conditionFilter').value='';
    byId('countryFilter').value='';
    byId('categoryFilter').dispatchEvent(new Event('change',{bubbles:true}));
    document.querySelectorAll('#rqMarketCategoryChips [data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===category));
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(!button)return;
    if(button.hasAttribute('data-browse'))browse();
    if(button.hasAttribute('data-maker'))browse(button.dataset.maker);
    if(button.hasAttribute('data-category'))browse('',button.dataset.category);
    if(button.hasAttribute('data-sell'))window.rqStartSell();
    if(button.hasAttribute('data-inbox'))window.rqOpenMarketInbox();
    if(button.hasAttribute('data-retry'))window.rqRefreshStore();
    if(button.hasAttribute('data-scroll'))document.querySelector('.maker-rail').scrollBy({left:Number(button.dataset.scroll)*240,behavior:'smooth'});
    if(button.dataset.rqEmptyAction==='clear')browse();
    if(button.dataset.rqEmptyAction==='brands'){route('home');document.querySelector('.manufacturer').scrollIntoView();}
  });
  byId('catalogSearch').addEventListener('submit',e=>{e.preventDefault();browse(byId('globalSearch').value.trim());});
  document.addEventListener('rq:languagechange',translate);
  document.addEventListener('rq:authchange',translate);
  document.addEventListener('DOMContentLoaded',translate);
})();
