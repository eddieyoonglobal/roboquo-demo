/* RoboQuo actual manufacturer logo catalog. 
 * URLs point to vendor-owned logos or documented brand logos.
 * These are third-party trademarks used for identifying manufacturer filters.
 * Fail closed to readable maker name when the image provider blocks the request.
 * This is a source-based mapping, not generated/re-created artwork.
 */
(function(){
'use strict';
const LOGOS={
  "FANUC": "https://commons.wikimedia.org/wiki/Special:FilePath/Fanuc_logo.svg",
  "Yaskawa": "https://www.yaskawa-global.com/img/common/logo.svg",
  "Universal Robots": "https://www.universal-robots.com/assets/header-logo-desktop.svg",
  "ABB Robotics": "https://commons.wikimedia.org/wiki/Special:FilePath/ABB_logo.svg",
  "KUKA": "https://www.kuka.com/-/media/kuka-corporate/images/home/logos/kuka_logo.svg?rev=-1&hash=D89635BD83E7413E2F1D8545163A3AA1",
  "Kawasaki Robotics": "https://kawasakirobotics.com/content/themes/krobot-theme/dist/images/common/logo.svg",
  "DENSO Robotics": "https://commons.wikimedia.org/wiki/Special:FilePath/DENSO_WAVE_Logp.png",
  "Doosan Robotics": "https://www.doosanrobotics.com/images/logo.svg",
  "Nachi-Fujikoshi": "https://www.nachi-fujikoshi.co.jp/dcms_media/image/logo-english.jpg",
  "OMRON Robotics": "https://commons.wikimedia.org/wiki/Special:FilePath/OMRON_Logo.svg",
  "Epson Robots": "https://raw.githubusercontent.com/glincker/thesvg/main/public/icons/epson/default.svg",
  "Stäubli Robotics": "https://commons.wikimedia.org/wiki/Special:FilePath/St%C3%A4ubli_International_logo.svg",
  "Comau": "https://www.comau.com/wp-content/uploads/2024/07/cropped-Logo-COMAU.png",
  "Rainbow Robotics": "https://rainbow-robotics.com/wp-content/uploads/2026/02/logo-dark.svg",
  "HD Hyundai Robotics": "https://commons.wikimedia.org/wiki/Special:FilePath/HD_Hyundai_Robotics_logo_KR.png",
  "OnRobot": "https://onrobot.com/images/logo.svg",
  "SCHUNK": "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_Schunk.svg",
  "Zimmer Group": "https://commons.wikimedia.org/wiki/Special:FilePath/Zimmer_Group.svg",
  "SMC": "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_SMC_Corporation.svg",
  "Schmalz": "https://www.schmalz.com/_static/1794485269864/schmalz.DqeEAYVi.svg",
  "Piab": "https://fistoar.github.io/Rap-Engineers-Rotary-valve/images/Logos/piab.webp",
  "CKD": "https://www.kohno-shoji.co.jp/resources/img/base/pcategory/cmp-10.jpg",
  "Gimatic": "https://gimatic.com/_nuxt/gimaticLogo.LoDLpaJw.svg",
  "Koganei": "https://www.koganei.co.jp/common/asset/logo.png",
  "Tesollo": "https://www.tesollo.com/branding/logo_color.svg",
  "WONIK Robotics": "https://wonikrobotics.com/img/svg/img_logo.svg",
  "AIDIN Robotics": "https://static.wixstatic.com/media/d71e42_e1d5db6bf45d40c484b0c0ff01481556~mv2.png/v1/fit/w_2500%2Ch_1330%2Cal_c/d71e42_e1d5db6bf45d40c484b0c0ff01481556~mv2.png",
  "ROBOTIS": "https://s3-symbol-logo.tradingview.com/robotis--600.png",
  "PISCO": "https://www.pisco.com/common/img/meta/ogp-img.png"
};
function init(){
 const cards=document.querySelectorAll('#robots .rq-featured-card[data-rq-featured-maker]');
 for(const card of cards){
  const brand=card.getAttribute('data-rq-featured-maker');
  const sources=LOGOS[brand], mark=card.querySelector('.rq-featured-brand-mark');
  if(!mark || !Array.isArray(sources)||sources.length===0){card.dataset.rqLogoStatus='missing';continue;}
  const mirror=window.RQ_MAKER_LOGO_LOCAL?.[brand];
  const allSources=mirror?[mirror,...sources]:sources;
  let index=0;
  const img=document.createElement('img');
  img.alt=brand;
  img.loading='lazy';
  img.decoding='async';
  img.width=140;img.height=42;
  img.className='rq-actual-maker-logo';
  img.addEventListener('load',()=>{
   if(img.naturalWidth>0){card.dataset.rqLogoStatus='loaded';return;}
   next();
  });
  function next(){
   index++;
   if(index<allSources.length){card.dataset.rqLogoStatus='trying-alternate';img.src=allSources[index];return;}
   mark.textContent=brand;
   card.dataset.rqLogoStatus='text-fallback';
  }
  img.addEventListener('error',next);
  mark.classList.remove('rq-featured-brand-mark--text');
  mark.replaceChildren(img);
  card.dataset.rqLogoStatus='pending';
  img.src=allSources[0];
 }
 window.rqManufacturerLogoReport=()=>({
  total:cards.length,
  loaded:[...cards].filter(x=>x.dataset.rqLogoStatus==='loaded').length,
  pending:[...cards].filter(x=>x.dataset.rqLogoStatus==='pending'||x.dataset.rqLogoStatus==='trying-alternate').length,
  fallback:[...cards].filter(x=>x.dataset.rqLogoStatus==='text-fallback').map(x=>x.dataset.rqFeaturedMaker),
  missing:[...cards].filter(x=>x.dataset.rqLogoStatus==='missing').map(x=>x.dataset.rqFeaturedMaker)
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();