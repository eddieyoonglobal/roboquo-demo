/* RoboQuo: simple, accessible BUY/SELL entry points. No fake listings. */
(function(){
'use strict';
const actionCopy={
 en:{buy:'Buy equipment',sell:'Sell equipment'},
 ja:{buy:'商品を購入',sell:'商品を売却'},
 ko:{buy:'제품 구매',sell:'제품 판매'},
 zh:{buy:'购买设备',sell:'出售设备'},
 de:{buy:'Geräte kaufen',sell:'Geräte verkaufen'},
 fr:{buy:'Acheter',sell:'Vendre'},
 es:{buy:'Comprar',sell:'Vender'},
 it:{buy:'Compra',sell:'Vendi'},
 pt:{buy:'Comprar',sell:'Vender'},
 vi:{buy:'Mua thiết bị',sell:'Bán thiết bị'}
};
function updateLanguage(){
 const lang=document.documentElement.lang||'en';
 const copy=actionCopy[lang]||actionCopy.en;
 const mobile=window.matchMedia&&window.matchMedia("(max-width:720px)").matches;
 const short={
  en:{buy:"Buy",sell:"Sell"},ko:{buy:"구매",sell:"판매"},ja:{buy:"購入",sell:"販売"},
  zh:{buy:"购买",sell:"出售"},de:{buy:"Kaufen",sell:"Verkaufen"},
  fr:{buy:"Acheter",sell:"Vendre"},es:{buy:"Comprar",sell:"Vender"},
  it:{buy:"Compra",sell:"Vendi"},pt:{buy:"Comprar",sell:"Vender"},
  vi:{buy:"Mua",sell:"Bán"}
 };
 const compact=short[lang]||short.en;
 const arrivals={
  en:"New arrivals",ko:"신규 매물",ja:"新着出品",zh:"最新上架",de:"Neue Angebote",
  fr:"Nouvelles annonces",es:"Nuevos anuncios",it:"Nuovi annunci",
  pt:"Novos anúncios",vi:"Tin đăng mới"
 };
 const vision={
  en:"Vision",ko:"비전·센서",ja:"ビジョン・センサー",zh:"视觉与传感器",
  de:"Bildverarbeitung",fr:"Vision",es:"Visión",it:"Visione",pt:"Visão",vi:"Thị giác máy"
 };
 const arrivalsLabel=document.getElementById("rqArrivals");
 const visionLabel=document.getElementById("rqVisionLabel");
 if(arrivalsLabel)arrivalsLabel.textContent=arrivals[lang]||arrivals.en;
 if(visionLabel)visionLabel.textContent=vision[lang]||vision.en;
 document.querySelectorAll('#robots [data-rq-quick-action],#home [data-rq-quick-action]').forEach(b=>{
  const type=b.dataset.rqQuickAction;
  if(type==='buy'||type==='sell'){b.textContent=mobile?compact[type]:copy[type];b.setAttribute('aria-label',copy[type]);}
 });
}
function showListings(){
 const page=document.getElementById('robots');
 if(page?.classList.contains('active')){
   document.getElementById('rqMarketSearchArea')?.scrollIntoView({behavior:'smooth',block:'start'});
   return;
 }
 if(typeof window.route==='function')window.route('robots');
 else location.hash='robots';
}
function beginSell(){
 const header=document.querySelector('.header-actions [data-action="sell"]');
 if(header){header.click();return;}
 if(typeof window.rqStartSell==='function')window.rqStartSell();
}
function init(){
 document.querySelectorAll('.rq-featured-card[data-rq-featured-maker]').forEach(card=>{
  const mark=card.querySelector('.rq-featured-brand-mark'),logo=mark?.querySelector('img');
  if(logo)logo.addEventListener('error',()=>{logo.remove();mark.textContent=card.dataset.rqFeaturedMaker||'';});
 });
 document.querySelectorAll('[data-rq-quick-action]').forEach(button=>{
  button.addEventListener('click',()=>{
   if(button.dataset.rqQuickAction==='buy')showListings();
   else beginSell();
  });
 });
 document.addEventListener('rq:languagechange',updateLanguage);
 window.addEventListener('resize',updateLanguage,{passive:true});
 updateLanguage();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();