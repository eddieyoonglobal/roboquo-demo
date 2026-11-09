/* RoboQuo browser smoke test with local fixtures only.
 * Run after: npm install --no-save --no-package-lock playwright@1.56.1
 * No real Supabase, account signup, upload, external APIs or production changes.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const { chromium }=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  let pathname='/';
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch(_){res.writeHead(400).end();return}
  let file=path.resolve(root,'.'+pathname);
  if(pathname==='/'||pathname.endsWith('/'))file=path.join(root,'index.html');
  if(!(file===root||file.startsWith(root+path.sep))){res.writeHead(403).end();return}
  fs.readFile(file,(err,body)=>{
    if(err){res.writeHead(404).end();return}
    res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'}).end(body);
  });
});
const closeServer=()=>new Promise(resolve=>server.close(resolve));
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const exe=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:exe||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{
   const url=route.request().url();
   if(url.startsWith(origin+'/'))return route.continue();
   if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))
    return route.fulfill({status:200,contentType:'application/javascript',body:
      "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
   if(url.startsWith('https://vlwaoawklpxvhbteikwj.supabase.co/'))
    return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   return route.abort();
  });
  await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.querySelectorAll('#marketListings .v24-listing-card').length>=3,null,{timeout:15000});
  const demo=await page.locator('#marketListings').innerText();
  assert.match(demo,/DEMO/i,'illustrative listings must be clearly marked');
  assert.equal(await page.locator('#marketListings .v24-listing-card .buy:not([disabled])').count(),0,'demo listings cannot be purchased');
  assert.equal(await page.evaluate(()=>window.rqCanWriteSupabase()),false,'localhost must not write to live DB');
  const screenshotDir=path.join(root,'test-artifacts');
  if(process.env.CI){
    fs.mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,'roboquo-home-desktop.png'),fullPage:true});
  }
  await page.evaluate(()=>route('robots'));
  await page.locator('#marketSearch').fill('FANUC');
  assert((await page.locator('#marketListings .v24-listing-card').count())>=1,'known robot search should find a card');
  await page.locator('#marketSearch').fill('NO_SUCH_ROBOT_MODEL_ZZZ_1234');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'unknown model should show no results');
  await page.locator('#marketSearch').fill('');
  // Inject a clearly synthetic published seller listing into the browser
  // presentation only. No Supabase insert or sign-in is performed.
  await page.evaluate(()=>{
    window.rqSetSellerLiveListings([{
      id:'seller:browser-fixture-001',backendId:'browser-fixture-001',
      brand:'FANUC',model:'CRX-10iA (TEST FIXTURE)',
      year:2024,location:'Tokyo',country:'Japan',price:123456,
      currency:'JPY',sale:'fixed',cat:'industrial',apps:[],hours:'—',
      operatingStatus:'stored',sellerCompany:'Fixture Company',
      verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',
      photoUrls:{},photoCount:1
    }]);
  });
  const live=page.locator('#marketListings .v24-listing-card').filter({hasText:'TEST FIXTURE'});
  assert.equal(await live.count(),1,'published seller listing renders alongside demo records');
  assert.equal(await live.locator('.v24-badge.demo').count(),0,'published listing cannot have demo badge');
  assert.equal(await live.locator('img').count(),1,'signed remote picture renders in the card');
  await live.locator('.v24-photo-button').click();
  assert.match(await page.locator('#modal').innerText(),/Stored \(seller reported\)/,'condition must be seller-reported, not invented');
  await page.locator('#modal .v24-modal-actions button').filter({hasText:'Contact RoboQuo'}).click();
  const mailto=await page.locator('#modal a[href^="mailto:"]').getAttribute('href');
  assert(mailto&&mailto.includes('browser-fixture-001'),'inquiry draft includes the listing reference');
  assert(mailto.includes('sales@roboquo.com'),'buyer inquiry opens a draft addressed to RoboQuo');
  if(process.env.CI)await page.screenshot({path:path.join(screenshotDir,'roboquo-buyer-inquiry-desktop.png'),fullPage:true});
  await page.evaluate(()=>window.closeModal());
  if(process.env.CI){
    await page.screenshot({path:path.join(screenshotDir,'roboquo-market-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(screenshotDir,'roboquo-market-mobile.png'),fullPage:true});
  }
  await page.evaluate(()=>window.rqStartSell());
  assert(await page.locator('#modal').isVisible(),'seller photo-first wizard should open');
  assert.equal(errors.length,0,'uncaught runtime errors: '+errors.join(' | '));
  console.log('PASS browser smoke: demo listing, local search, protected preview, sell wizard, no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(closeServer);
