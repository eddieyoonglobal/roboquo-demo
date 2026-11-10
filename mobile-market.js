/* Mobile-first RoboQuo classifieds controls, mounted above the market.
   Uses existing category/condition/search filters and only actual seller listings.
   No additional listings, uploads, account writes or payment operations. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const messages={
ja:{search:'商品名・メーカーを検索',all:'おすすめ',used:'中古',new:'新品',brands:'メーカー',reset:'検索を消去',scope:'商品を探す'},
ko:{search:'상품명·브랜드 검색',all:'전체',used:'중고',new:'신품',brands:'브랜드',reset:'검색 지우기',scope:'상품 검색'},
en:{search:'Search item or brand',all:'All',used:'Used',new:'New',brands:'Brands',reset:'Clear search',scope:'Search listings'},
zh:{search:'搜索商品或品牌',all:'全部',used:'二手',new:'全新',brands:'品牌',reset:'清除搜索',scope:'搜索商品'},
de:{search:'Artikel oder Marke',all:'Alle',used:'Gebraucht',new:'Neu',brands:'Marken',reset:'Suche löschen',scope:'Angebote suchen'},
fr:{search:'Article ou marque',all:'Tous',used:'Occasion',new:'Neuf',brands:'Marques',reset:'Effacer la recherche',scope:'Rechercher des annonces'},
es:{search:'Artículo o marca',all:'Todos',used:'Usado',new:'Nuevo',brands:'Marcas',reset:'Borrar búsqueda',scope:'Buscar artículos'},
it:{search:'Articolo o marchio',all:'Tutti',used:'Usato',new:'Nuovo',brands:'Marchi',reset:'Cancella ricerca',scope:'Cerca annunci'},
pt:{search:'Item ou marca',all:'Todos',used:'Usado',new:'Novo',brands:'Marcas',reset:'Limpar pesquisa',scope:'Buscar anúncios'},
vi:{search:'Sản phẩm hoặc hãng',all:'Tất cả',used:'Đã dùng',new:'Mới',brands:'Thương hiệu',reset:'Xóa tìm kiếm',scope:'Tìm sản phẩm'}
};
const lang=()=>document.documentElement.lang||'en';
const copy=()=>messages[lang()]||messages.en;
let syncing=false;
function sendEvent(el,type){el.dispatchEvent(new Event(type,{bubbles:true}))}
function updateView(){
 const source=$('marketSearch'),target=$('rqMobileQuery'),condition=$('conditionFilter'),reset=$('rqMobileReset');
 if(!source||!target)return;
 if(!syncing&&target.value!==source.value)target.value=source.value;
 if(reset)reset.hidden=!target.value.trim();
 const value=condition?.value||'';
 document.querySelectorAll('[data-rq-mobile-condition]').forEach(btn=>{
  btn.setAttribute('aria-pressed',String(btn.dataset.rqMobileCondition===value));
 });
 const t=copy();
 target.placeholder=t.search;target.setAttribute('aria-label',t.scope);
 if(reset)reset.setAttribute('aria-label',t.reset);
 for(const key of ['all','used','new']){
  const btn=document.querySelector('[data-rq-mobile-condition="'+(key==='all'?'':key)+'"]');
  if(btn)btn.textContent=t[key];
 }
 const brands=document.querySelector('[data-rq-mobile-action="brands"]');
 if(brands)brands.textContent=t.brands;
}
function changeSearch(value){
 const original=$('marketSearch');if(!original)return;
 syncing=true;original.value=value;sendEvent(original,'input');syncing=false;updateView();
}
function changeCondition(value){
 const condition=$('conditionFilter');if(!condition)return;
 condition.value=value;sendEvent(condition,'change');updateView();
}
function goMakers(){
 if(typeof window.route==='function')window.route('makers');
}
function init(){
 const mobile=$('rqMobileQuery'),desktop=$('marketSearch');
 if(!mobile||!desktop)return;
 mobile.addEventListener('input',()=>changeSearch(mobile.value));
 desktop.addEventListener('input',()=>{if(!syncing)updateView()});
 $('rqMobileReset')?.addEventListener('click',()=>{mobile.value='';changeSearch('');mobile.focus()});
 mobile.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();mobile.blur();$('marketListings')?.scrollIntoView({behavior:'smooth',block:'start'});}
 });
 for(const btn of document.querySelectorAll('[data-rq-mobile-condition]')){
  btn.addEventListener('click',()=>changeCondition(btn.dataset.rqMobileCondition));
 }
 document.querySelector('[data-rq-mobile-action="brands"]')?.addEventListener('click',goMakers);
 $('conditionFilter')?.addEventListener('change',updateView);
 $('categoryFilter')?.addEventListener('change',updateView);
 document.addEventListener('rq:languagechange',updateView);
 updateView();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
