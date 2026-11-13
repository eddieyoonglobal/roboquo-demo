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
 Japan:['FANUC','Yaskawa','Kawasaki Robotics','DENSO Robotics','Nachi-Fujikoshi','OMRON Robotics','Epson Robots'],
 Korea:['Doosan Robotics','Rainbow Robotics','HD Hyundai Robotics']
};
const translations={
 en:{all:'All makers',china:'China',taiwan:'Taiwan',korea:'Korea',japan:'Japan',label:'Filter manufacturer origin'},
 ko:{all:'전체 제조사',china:'중국',taiwan:'대만',korea:'한국',japan:'일본',label:'제조사 국가 선택'},
 ja:{all:'全メーカー',china:'中国',taiwan:'台湾',korea:'韓国',japan:'日本',label:'メーカー所在国で選択'},
 zh:{all:'全部品牌',china:'中国',taiwan:'台湾',korea:'韩国',japan:'日本',label:'按制造商国家筛选'}
};
function init(){
 const track=document.getElementById('rqRobotMakerTrack');
 if(!track||document.getElementById('rqMakerRegionPicker'))return;
 for(const [origin,names] of Object.entries(originals))for(const name of names){
  const button=[...track.querySelectorAll('[data-rq-featured-maker]')].find(el=>el.dataset.rqFeaturedMaker===name);
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
 const nav=document.createElement('div');nav.id='rqMakerRegionPicker';nav.className='rq-region-picker';
 for(const name of ['','China','Taiwan','Korea','Japan']){
  const button=document.createElement('button');button.type='button';button.dataset.rqRegionFilter=name;button.setAttribute('aria-pressed',String(name===''));nav.appendChild(button);
 }
 track.parentElement.insertBefore(nav,track);
 const regionBtns=[...nav.querySelectorAll('button')];
 function labelUpdate(){
  const locale=document.getElementById('languageSelect')?.value||document.documentElement.lang||'en',t=translations[locale]||translations.en;
  nav.setAttribute('aria-label',t.label);
  regionBtns.forEach(btn=>btn.textContent=t[(btn.dataset.rqRegionFilter||'all').toLowerCase()]||btn.dataset.rqRegionFilter);
 }
 function regionUpdate(region){
  [...track.querySelectorAll('.rq-featured-product')].forEach(el=>{el.hidden=Boolean(region)&&el.dataset.rqRegion!==region;});
  regionBtns.forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.rqRegionFilter===region)));
  track.scrollLeft=0;
 }
 regionBtns.forEach(btn=>btn.addEventListener('click',()=>regionUpdate(btn.dataset.rqRegionFilter)));
 document.getElementById('languageSelect')?.addEventListener('change',labelUpdate);
 document.addEventListener('rq:languagechange',labelUpdate);
 labelUpdate();regionUpdate('');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
