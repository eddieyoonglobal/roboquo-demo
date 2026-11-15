/* RoboQuo AMR/AGV manufacturer navigation: genuine marks, no fake inventory. */
(()=>{
 'use strict';
 const T={
  en:{heading:'AMR & AGV manufacturers',note:'Mobile robot makers · not live listings',all:'All',official:'Official website',filter:'Search listings for',region:'Manufacturer region',noLogo:'Logo unavailable',loading:'Loading manufacturers…'},
  ko:{heading:'AMR·AGV·무인운반차 메이커',note:'제조사 소개 · 판매 매물이 아닙니다',all:'전체',official:'공식 홈페이지',filter:'매물 검색:',region:'제조사 지역',noLogo:'로고 확인 중',loading:'제조사 불러오는 중…'},
  ja:{heading:'AMR・AGV・無人搬送車メーカー',note:'メーカー紹介・販売中の出品ではありません',all:'すべて',official:'公式サイト',filter:'出品を検索：',region:'メーカーの地域',noLogo:'ロゴ未確認',loading:'メーカーを読み込み中…'},
  zh:{heading:'AMR／AGV 移动机器人厂商',note:'厂商目录，不代表在售商品',all:'全部',official:'官方网站',filter:'搜索在售商品：',region:'厂商地区',noLogo:'标志待确认',loading:'加载厂商中…'},
  de:{heading:'AMR- & AGV-Hersteller',note:'Hersteller, keine Verkaufsangebote',all:'Alle',official:'Herstellerseite',filter:'Angebote suchen:',region:'Region',loading:'Hersteller laden…'},
  fr:{heading:'Fabricants AMR et AGV',note:'Fabricants, pas des annonces',all:'Tous',official:'Site officiel',filter:'Chercher les annonces :',region:'Région',loading:'Chargement…'},
  es:{heading:'Fabricantes de AMR y AGV',note:'Directorio, no son anuncios',all:'Todos',official:'Sitio oficial',filter:'Buscar anuncios:',region:'Región',loading:'Cargando…'},
  it:{heading:'Produttori AMR e AGV',note:'Produttori, non annunci di vendita',all:'Tutti',official:'Sito ufficiale',filter:'Cerca annunci:',region:'Regione',loading:'Caricamento…'},
  pt:{heading:'Fabricantes de AMR e AGV',note:'Fabricantes, não anúncios',all:'Todos',official:'Site oficial',filter:'Procurar anúncios:',region:'Região',loading:'Carregando…'},
  vi:{heading:'Hãng AMR và AGV',note:'Danh mục hãng, không phải hàng bán',all:'Tất cả',official:'Trang chính thức',filter:'Tìm tin bán:',region:'Khu vực',loading:'Đang tải…'}
 };
 const regionLabels={
  en:{Japan:'Japan',Korea:'Korea',China:'China',Europe:'Europe',USA:'USA'},
  ko:{Japan:'일본',Korea:'한국',China:'중국',Europe:'유럽',USA:'미국'},
  ja:{Japan:'日本',Korea:'韓国',China:'中国',Europe:'欧州',USA:'米国'},
  zh:{Japan:'日本',Korea:'韩国',China:'中国',Europe:'欧洲',USA:'美国'}
 };
 const $=id=>document.getElementById(id);
 const cleanURL=url=>typeof url==='string'&&url.startsWith('https://')?url:'';
 let makers=[],region='',initialized=false;
 const lang=()=>T[document.getElementById('languageSelect')?.value||document.documentElement.lang]||T.en;
 const locale=()=>document.getElementById('languageSelect')?.value||document.documentElement.lang||'en';
 function apply(){
  const t=lang(),reg=regionLabels[locale()]||regionLabels.en;
  $('rqAmrTitle').textContent=t.heading;
  $('rqAmrNote').textContent=t.note;
  $('rqAmrRegions').setAttribute('aria-label',t.region);
  for(const b of $('rqAmrRegions').querySelectorAll('button[data-amr-region]')){
   b.textContent=b.dataset.amrRegion?(reg[b.dataset.amrRegion]||b.dataset.amrRegion):t.all;
   b.setAttribute('aria-pressed',String(b.dataset.amrRegion===region));
  }
  for(const b of $('rqAmrTrack').querySelectorAll('.rq-amr-maker')){
   b.setAttribute('aria-label',t.filter+' '+b.dataset.maker);
   b.title=t.filter+' '+b.dataset.maker;
  }
  for(const a of $('rqAmrTrack').querySelectorAll('.rq-amr-official')){
   a.title=t.official+' · '+a.dataset.maker;
   a.setAttribute('aria-label',t.official+' · '+a.dataset.maker);
  }
 }
 function filter(regionName){
  region=regionName;
  for(const card of $('rqAmrTrack').querySelectorAll('.rq-amr-item')){
   card.hidden=!!region&&card.dataset.region!==region;
  }
  $('rqAmrTrack').scrollLeft=0;
  apply();
 }
 function searchListings(maker){
  if(typeof window.route==='function')window.route('robots');
  const category=$('categoryFilter'),input=$('marketSearch');
  // The current marketplace schema uses category "robot" for mobile robots too.
  if(category){category.value='robot';category.dispatchEvent(new Event('change',{bubbles:true}));}
  if(input){input.value=maker.search||maker.name;input.dispatchEvent(new Event('input',{bubbles:true}));}
  $('rqMarketSearchArea')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function markImage(button,frame,maker){
  let candidates=[];
  if(window.RQ_AMR_MAKER_LOCAL?.[maker.name])candidates.push(window.RQ_AMR_MAKER_LOCAL[maker.name]);
  if(window.RQ_MAKER_LOGO_LOCAL?.[maker.name])candidates.push(window.RQ_MAKER_LOGO_LOCAL[maker.name]);
  candidates.push(...(maker.logoSources||[]));
  candidates=[...new Set(candidates.filter(url=>typeof url==='string'&&(url.startsWith('./assets/')||url.startsWith('https://'))))];
  // Start with one readable name; replace it with official artwork only after load.
  frame.textContent=maker.name;
  if(!candidates.length){button.dataset.amrLogo='unverified';return;}
  let idx=0;
  const image=new Image();image.alt=maker.name;image.loading='eager';image.decoding='async';
  image.className='rq-amr-logo';
  function next(){if(idx>=candidates.length){button.dataset.amrLogo='fallback';return;}
   image.src=candidates[idx++];}
  image.addEventListener('load',()=>{if(image.naturalWidth>0&&image.naturalHeight>0){
   frame.replaceChildren(image);button.dataset.amrLogo='loaded';
  }else next();});
  image.addEventListener('error',next);
  button.dataset.amrLogo='pending';next();
 }
 function render(){
  const track=$('rqAmrTrack');
  if(!track)return;
  track.replaceChildren();
  for(const maker of makers){
   const card=document.createElement('article');card.className='rq-amr-item';
   card.dataset.region=maker.region;card.dataset.maker=maker.name;card.setAttribute('role','listitem');
   const button=document.createElement('button');button.type='button';button.className='rq-amr-maker';
   button.dataset.maker=maker.name;
   const mark=document.createElement('span');mark.className='rq-amr-mark';
   button.append(mark);card.append(button);button.addEventListener('click',()=>searchListings(maker));
   markImage(button,mark,maker);
   const link=document.createElement('a');link.className='rq-amr-official';
   link.href=cleanURL(maker.website);link.target='_blank';link.rel='noopener noreferrer';
   link.dataset.maker=maker.name;link.textContent='↗';
   card.append(link);track.append(card);
  }
  filter('');
  $('rqAmrShowcase').dataset.state='ready';
  window.RQ_AMR_MAKERS_REPORT=()=>({total:makers.length,loaded:track.querySelectorAll('[data-amr-logo="loaded"]').length,failed:[...track.querySelectorAll('[data-amr-logo="fallback"],[data-amr-logo="unverified"]')].map(e=>e.dataset.maker),regions:[...new Set(makers.map(x=>x.region))]});
 }
 function init(){
  if(initialized||!$('rqAmrShowcase'))return;initialized=true;
  $('rqAmrTrack').textContent=lang().loading;
  const filters=$('rqAmrRegions');
  for(const name of ['','Japan','Korea','China','Europe','USA']){
   const b=document.createElement('button');b.type='button';b.dataset.amrRegion=name;
   b.addEventListener('click',()=>filter(name));filters.append(b);
  }
  for(const nav of document.querySelectorAll('[data-rq-amr-scroll]')){
   nav.addEventListener('click',()=>$('rqAmrTrack').scrollBy({left:Math.max(250,$('rqAmrTrack').clientWidth*.75)*Number(nav.dataset.rqAmrScroll),behavior:'smooth'}));
  }
  document.addEventListener('rq:languagechange',apply);
  $('languageSelect')?.addEventListener('change',apply);
  fetch('./amr-maker-sources.json?v=20261115',{cache:'no-store'})
   .then(r=>{if(!r.ok)throw Error('AMR directory HTTP '+r.status);return r.json()})
   .then(data=>{
    makers=(data.makers||[]).filter(x=>x.name&&cleanURL(x.website)&&['Japan','Korea','China','Europe','USA'].includes(x.region));
    if(!makers.length)throw Error('AMR maker directory empty');
    render();
   }).catch(e=>{
    $('rqAmrTrack').textContent='Manufacturer directory unavailable';
    $('rqAmrShowcase').dataset.state='error';console.warn('[RoboQuo AMR]',e.message);
   });
  apply();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
