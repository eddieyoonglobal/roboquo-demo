/* Default to English on each new page load, keep explicit language switching available. */
(function(){
'use strict';
function init(){
 document.querySelectorAll('.rq-featured-card[data-rq-featured-maker]').forEach(card=>{
  // A manufacturer brand mark is the directory entry; pictures are reserved for real sale listings.
  const mark=card.querySelector('.rq-featured-brand-mark');
  if(mark){
   const logo=mark.querySelector('img');
   if(logo){logo.addEventListener('error',()=>{logo.remove();mark.textContent=card.dataset.rqFeaturedMaker||'';});}
  }
 });
 document.querySelectorAll('[data-rq-quick-action]').forEach(button=>{
  button.addEventListener('click',()=>{
   if(button.dataset.rqQuickAction==='buy'){
    if(typeof window.route==='function')window.route('robots');
    else location.hash='robots';
   }else{
    const sell=document.querySelector('.header-actions [data-action="sell"]');
    if(sell)sell.click();
   }
  });
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
