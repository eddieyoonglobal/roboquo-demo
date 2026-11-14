/* RoboQuo maker filter expansion; images are provided from original vendor files. */
(function(){
'use strict';
const manufacturers=[
 {name:'DOBOT',origin:'China',src:'dobot-approved.png',query:'Dobot'},
 {name:'JAKA',origin:'China',src:'jaka-approved.png',query:'JAKA'},
 {name:'ESTUN',origin:'China',src:'estun-approved.png',query:'ESTUN'},
 {name:'Techman Robot',origin:'Taiwan',src:'techman-approved.png',query:'Techman'},
 {name:'HIWIN',origin:'Taiwan',src:'hiwin-approved.png',query:'HIWIN'},
 {name:'Delta Electronics',origin:'Taiwan',src:'delta-approved.png',query:'Delta'},
 {name:'Hanwha Robotics',origin:'Korea',src:'hanwha-approved.png',query:'Hanwha'},
 {name:'Neuromeka',origin:'Korea',src:'neuromeka-approved.png',query:'Neuromeka'}
];
const originals={
 Japan:['FANUC','Yaskawa','Kawasaki Robotics','DENSO Robotics','Nachi-Fujikoshi','OMRON Robotics','Epson Robots','SMC','CKD','Koganei','PISCO'],
 Korea:['Doosan Robotics','Rainbow Robotics','HD Hyundai Robotics','Tesollo','WONIK Robotics','AIDIN Robotics','ROBOTIS'],
 Europe:['Universal Robots','ABB Robotics','KUKA','Stäubli Robotics','Comau','OnRobot','SCHUNK','Zimmer Group','Schmalz','Piab','Gimatic']
};
const translations={
 en:{all:'All makers',japan:'Japan',korea:'Korea',china:'China',taiwan:'Taiwan',europe:'Europe',label:'Filter maker region'},
 ko:{all:'전체 메이커',japan:'일본',korea:'한국',china:'중국',taiwan:'대만',europe:'유럽',label:'제조사 지역별 보기'},
 ja:{all:'すべて',japan:'日本',korea:'韓国',china:'中国',taiwan:'台湾',europe:'欧州',label:'メーカーの地域で絞り込む'},
 zh:{all:'全部品牌',japan:'日本',korea:'韩国',china:'中国',taiwan:'台湾',europe:'欧洲',label:'按制造商地区筛选'},
 de:{all:'Alle Marken',japan:'Japan',korea:'Korea',china:'China',taiwan:'Taiwan',europe:'Europa',label:'Herstellerregion wählen'},
 fr:{all:'Toutes marques',japan:'Japon',korea:'Corée',china:'Chine',taiwan:'Taïwan',europe:'Europe',label:'Filtrer par région'},
 es:{all:'Todas las marcas',japan:'Japón',korea:'Corea',china:'China',taiwan:'Taiwán',europe:'Europa',label:'Filtrar por región'},
 it:{all:'Tutti i marchi',japan:'Giappone',korea:'Corea',china:'Cina',taiwan:'Taiwan',europe:'Europa',label:'Filtra per regione'},
 pt:{all:'Todas as marcas',japan:'Japão',korea:'Coreia',china:'China',taiwan:'Taiwan',europe:'Europa',label:'Filtrar por região'},
 vi:{all:'Tất cả hãng',japan:'Nhật Bản',korea:'Hàn Quốc',china:'Trung Quốc',taiwan:'Đài Loan',europe:'Châu Âu',label:'Lọc theo khu vực'}
};
function init(){
 const track=document.getElementById('rqRobotMakerTrack');
 const eoatTrack=document.getElementById('rqEoatMakerTrack');
 if(!track||document.getElementById('rqMakerRegionPicker'))return;
 for(const [origin,names] of Object.entries(originals))for(const name of names){
  const button=[...document.querySelectorAll('#robots [data-rq-featured-maker]')].find(el=>el.dataset.rqFeaturedMaker===name);
  if(button){const item=button.closest('.rq-featured-product');if(item)item.dataset.rqRegion=origin;if(name==='FANUC')item.dataset.rqFeaturedBrand='FANUC';}
 }
 const existing=new Set([...track.querySelectorAll('[data-rq-featured-maker]')].map(el=>el.dataset.rqFeaturedMaker));
 for(const maker of manufacturers){
  if(existing.has(maker.name))continue;
  const card=document.createElement('article');card.className='rq-featured-product';card.setAttribute('role','listitem');card.dataset.rqRegion=maker.origin;
  const button=document.createElement('button');button.type='button';button.className='rq-featured-card';button.dataset.rqFeaturedMaker=maker.name;button.dataset.rqFeaturedKind='robot';button.setAttribute('aria-label','Filter listings by '+maker.name);
  const mark=document.createElement('span');mark.className='rq-featured-brand-mark';
  const img=document.createElement('img');img.className='rq-actual-maker-logo';img.alt=maker.name;img.loading='lazy';img.decoding='async';img.width=180;img.height=60;
  img.src='assets/maker-logos/'+maker.src;
  img.addEventListener('load',()=>{button.dataset.rqLogoStatus='loaded';});
  img.addEventListener('error',()=>{mark.textContent=maker.name;button.dataset.rqLogoStatus='text-fallback';});
  mark.appendChild(img);button.appendChild(mark);card.appendChild(button);track.appendChild(card);
  button.addEventListener('click',()=>{
   if(typeof window.route==='function')window.route('robots');
   const cat=document.getElementById('categoryFilter'),search=document.getElementById('marketSearch');
   if(cat){cat.value='robot';cat.dispatchEvent(new Event('change',{bubbles:true}));}
   if(search){search.value=maker.query;search.dispatchEvent(new Event('input',{bubbles:true}));}
   document.querySelectorAll('#robots [data-rq-featured-maker]').forEach(el=>el.classList.toggle('rq-selected-brand',el===button));
   document.getElementById('rqMarketSearchArea')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
 }
 function setupRegionPicker(target,id,regions){
  if(!target||document.getElementById(id))return;
  const nav=document.createElement('div');nav.id=id;nav.className='rq-region-picker';
  nav.setAttribute('role','group');
  for(const name of regions){
   const button=document.createElement('button');button.type='button';
   button.dataset.rqRegionFilter=name;
   button.setAttribute('aria-pressed',String(name===''));
   nav.appendChild(button);
  }
  target.parentElement.insertBefore(nav,target);
  const regionBtns=[...nav.querySelectorAll('button')];
  function labelUpdate(){
   const locale=(document.getElementById('languageSelect')?.value||document.documentElement.lang||'en').split('-')[0];
   const t=translations[locale]||translations.en;
   nav.setAttribute('aria-label',t.label);
   regionBtns.forEach(btn=>{
    const region=btn.dataset.rqRegionFilter||'all';
    btn.textContent=t[region.toLowerCase()]||region;
   });
  }
  function regionUpdate(region){
   target.querySelectorAll('.rq-featured-product').forEach(item=>{
    item.hidden=Boolean(region)&&item.dataset.rqRegion!==region;
   });
   regionBtns.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.rqRegionFilter===region)));
   target.scrollLeft=0;
  }
  regionBtns.forEach(btn=>btn.addEventListener('click',()=>regionUpdate(btn.dataset.rqRegionFilter)));
  document.getElementById('languageSelect')?.addEventListener('change',labelUpdate);
  document.addEventListener('rq:languagechange',labelUpdate);
  labelUpdate();regionUpdate('');
 }
 setupRegionPicker(track,'rqMakerRegionPicker',['','Japan','Korea','China','Taiwan','Europe']);
 setupRegionPicker(eoatTrack,'rqEoatRegionPicker',['','Japan','Korea','Europe']);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
