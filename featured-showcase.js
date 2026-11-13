/* RoboQuo reference maker strip, not items for sale.
 * Source photos: FANUC CC BY 4.0, Yaskawa CC BY-SA 4.0, UR5e CC BY-SA 4.0, ABB CC BY 2.5, KUKA CC BY 4.0.
 * Remaining robot/EOAT cards use clearly labeled brand-neutral illustrations until photo usage rights are cleared.
 * Two horizontal galleries navigate the verified manufacturer directory. Never fake seller inventory.
 */
(function(){
'use strict';
const texts={
 en:{title:'Filter by robot brand',note:'Reference photos or illustrations · not items for sale',onrobot:'Illustration · Official products',eoat:'Filter by gripper & EOAT brand',eoatNote:'Maker references · not seller listings'},
 ja:{title:'ロボットメーカーで絞り込む',note:'参考写真・イメージ図／出品商品ではありません',onrobot:'イメージ図・公式製品はこちら',eoat:'グリッパーメーカーで絞り込む',eoatNote:'メーカー紹介／出品商品ではありません'},
 ko:{title:'로봇 제조사로 검색',note:'참고 사진·설명용 그림 · 판매 매물 아님',onrobot:'설명용 그림 · 공식 제품 보기',eoat:'그리퍼 제조사로 검색',eoatNote:'제조사 소개 · 실제 판매 매물 아님'},
 zh:{title:'主要机器人品牌',note:'参考照片，非在售商品',onrobot:'示意图 · 官方产品'},
 de:{title:'Bekannte Robotermarken',note:'Referenzbilder, keine Verkaufsangebote',onrobot:'Illustration · Herstellerprodukte'},
 fr:{title:'Fabricants de robots reconnus',note:'Photos de référence, pas des annonces',onrobot:'Illustration · Produits officiels'},
 es:{title:'Fabricantes reconocidos',note:'Fotos de referencia, no anuncios',onrobot:'Ilustración · Productos oficiales'},
 it:{title:'Produttori di robot noti',note:'Foto indicative, non inserzioni',onrobot:'Illustrazione · Prodotti ufficiali'},
 pt:{title:'Fabricantes de robôs conhecidos',note:'Fotos de referência, não anúncios',onrobot:'Ilustração · Produtos oficiais'},
 vi:{title:'Các thương hiệu robot tiêu biểu',note:'Ảnh tham khảo, không phải tin bán hàng',onrobot:'Minh họa · Sản phẩm chính thức'}
};
const $=id=>document.getElementById(id);
function apply(){
 const t=texts[document.documentElement.lang]||texts.en;
 if($('rqFeaturedTitle'))$('rqFeaturedTitle').textContent=t.title;
 if($('rqFeaturedNote'))$('rqFeaturedNote').textContent=t.note;
 if($('rqEoatTitle'))$('rqEoatTitle').textContent=t.eoat||texts.en.eoat;
 if($('rqEoatNote'))$('rqEoatNote').textContent=t.eoatNote||texts.en.eoatNote;
 if($('rqOnRobotPhotoNote'))$('rqOnRobotPhotoNote').textContent=t.onrobot;
}
/* Brand cards now filter actual seller listings; they are not a manufacturer directory. */
function openDirectory(brand,kind){
 const aliases={
  'ABB Robotics':'ABB','Kawasaki Robotics':'Kawasaki','DENSO Robotics':'DENSO',
  'Doosan Robotics':'Doosan','Stäubli Robotics':'Stäubli','Epson Robots':'Epson',
  'HD Hyundai Robotics':'Hyundai','Rainbow Robotics':'Rainbow','Hanwha Robotics':'Hanwha','Neuromeka':'Neuromeka','WONIK Robotics':'WONIK','AIDIN Robotics':'AIDIN'
 };
 const query=aliases[brand]||brand;
 const category=document.getElementById('categoryFilter');
 const search=document.getElementById('marketSearch');
 if(typeof window.route==='function')window.route('robots');
 if(category){category.value=kind==='eoat'?'gripper':'robot';category.dispatchEvent(new Event('change',{bubbles:true}));}
 if(search){search.value=query;search.dispatchEvent(new Event('input',{bubbles:true}));}
 document.querySelectorAll('.rq-featured-card[data-rq-featured-maker]').forEach(b=>{
  b.classList.toggle('rq-selected-brand',b.dataset.rqFeaturedMaker===brand);
 });
 document.getElementById('rqMarketSearchArea')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function init(){
 document.querySelectorAll('.rq-maker-arrow').forEach(btn=>{
  btn.addEventListener('click',()=>{
   const track=$(btn.dataset.rqGallery);
   if(!track)return;
   const distance=Math.max(260,Math.floor(track.clientWidth*.8));
   track.scrollBy({left:Number(btn.dataset.rqScroll)*distance,behavior:'smooth'});
  });
 });
 document.querySelectorAll('.rq-featured-card[data-rq-featured-maker]').forEach(btn=>{
  btn.addEventListener('click',()=>openDirectory(btn.dataset.rqFeaturedMaker,btn.dataset.rqFeaturedKind));
 });
 document.querySelectorAll('.rq-featured-card img[data-rq-photo-fallback],.rq-category-real-photo[data-rq-photo-fallback]').forEach(img=>{
  const useFallback=()=>{
   if(img.dataset.photoFallbackApplied==='true')return;
   img.dataset.photoFallbackApplied='true';
   img.closest('.rq-featured-product')?.classList.add('rq-photo-fallback');
   img.classList.add('rq-category-photo-fallback');
   img.src=img.dataset.rqPhotoFallback;
   img.alt='Generic illustration: licensed maker photo currently unavailable';
  };
  img.addEventListener('error',useFallback);
  if(img.complete&&img.naturalWidth===0)useFallback();
 });
 document.addEventListener('rq:languagechange',apply);
 apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
