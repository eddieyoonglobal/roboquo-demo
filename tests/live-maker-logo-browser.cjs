#!/usr/bin/env node
/* Browser-only, read-only proof that all 29 authentic maker logos display. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const SITE=(process.env.ROBOQUO_SITE||'https://roboquo.com').replace(/\/$/,'');
const OUT=path.join(process.cwd(),'test-artifacts');
(async()=>{
fs.mkdirSync(OUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const result=[];
try{
 for(const device of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:device.width,height:device.height},serviceWorkers:'block'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(SITE+'/#robots',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.status(),200,'Public site must load');
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{
    if(typeof window.route==='function')window.route('robots');
    else location.hash='#robots';
  });
  const cards=page.locator('#robots .rq-featured-card[data-rq-featured-maker]');
  await cards.first().waitFor({timeout:15000});
  const n=await cards.count();
  assert.equal(n,29,'Expected 29 manufacturer cards');
  const failures=[];
  for(let i=0;i<n;i++){
   const card=cards.nth(i);
   const brand=await card.getAttribute('data-rq-featured-maker');
   await card.scrollIntoViewIfNeeded();
   try{
    await page.waitForFunction(brand=>{
      const b=[...document.querySelectorAll('#robots .rq-featured-card')].find(el=>el.dataset.rqFeaturedMaker===brand);
      const img=b?.querySelector('.rq-actual-maker-logo');
      return Boolean(img&&img.complete&&img.naturalWidth>0&&img.naturalHeight>0);
    },brand,{timeout:9000});
   }catch(e){
    failures.push({brand,status:await card.getAttribute('data-rq-logo-status'),img:await card.locator('img').count()});
   }
  }
  await page.locator('#rqFeaturedShowcase').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(OUT,'roboquo-logos-'+device.name+'.png'),fullPage:false});
  const state=await page.evaluate(()=>window.rqManufacturerLogoReport?.());
  result.push({device:device.name,cards:n,failures,logoState:state,jsErrors:errors.slice(0,8)});
  console.log(JSON.stringify(result[result.length-1]));
  await page.close();
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'roboquo-logos-browser-report.json'),JSON.stringify(result,null,2));
const missing=result.flatMap(x=>x.failures.map(z=>x.device+':'+z.brand));
assert.equal(missing.length,0,'Manufacturer images failed to render: '+missing.join(', '));
console.log('PASS: all 29 manufacturer logo images rendered on both desktop and mobile');
})().catch(e=>{console.error(e.stack);process.exit(1)});