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
  await page.waitForFunction(()=>Boolean(document.querySelector('#marketListings .rq-market-empty')),{timeout:15000});
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'no fake robot inventory is displayed');
  assert.equal(await page.locator('#homeListings .v24-listing-card').count(),0,'homepage contains real listings only');
  assert.equal(await page.evaluate(()=>window.rqCanWriteSupabase()),false,'Preview stays read-only against production');
  const screenshotDir=path.join(root,'test-artifacts');
  if(process.env.CI){
    fs.mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,'roboquo-home-desktop.png'),fullPage:true});
  }
  await page.evaluate(()=>route('robots'));
  assert.equal(await page.locator('#rqMarketCategoryChips button').count(),8,'robot/part category shortcuts render');
  await page.evaluate(()=>window.rqSetSellerLiveListings([
    {id:'seller:robot-fixture',backendId:'robot-fixture',brand:'FANUC',model:'CRX TEST',year:2024,location:'Tokyo',country:'Japan',
      price:2250000,currency:'JPY',sale:'fixed',cat:'industrial',itemCategory:'robot',itemCondition:'used',description:'Real robot fixture',
      apps:[],hours:'—',operatingStatus:'stored',sellerCompany:'Fixture Company',verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{},photoCount:1},
    {id:'seller:gripper-fixture',backendId:'gripper-fixture',brand:'OnRobot',model:'RG2 GRIPPER TEST',location:'Osaka',country:'Japan',
      price:48000,currency:'JPY',sale:'fixed',cat:'gripper',itemCategory:'gripper',itemCondition:'used',description:'Actual used gripper fixture',
      apps:[],hours:'—',operatingStatus:'unknown',sellerCompany:'Parts Fixture Seller',verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{},photoCount:1}
  ]));
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'only 2 real seller fixtures are visible');
  assert.equal(await page.locator('#marketListings .v24-badge.demo').count(),0,'no DEMO cards shown');
  await page.locator('#rqMarketCategoryChips button[data-filter="gripper"]').click();
  const filterDebug=await page.evaluate(()=>({value:document.querySelector('#categoryFilter')?.value,options:[...document.querySelector('#categoryFilter').options].map(o=>o.value),hasRender:typeof window.rqRenderMarketplace,items:allRobotListings().filter(x=>x._source==='seller-supabase').map(x=>({id:x.id,category:x.itemCategory}))}));
  console.log('MARKET_FILTER_DEBUG',JSON.stringify(filterDebug));
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'gripper category works');
  await page.locator('#marketSearch').fill('NONEXISTENT-ROBOT-000');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'search filters real listings');
  await page.locator('#marketSearch').fill('RG2');
  const grip=page.locator('#marketListings .v24-listing-card');
  assert.equal(await grip.count(),1);
  await grip.locator('.v24-photo-button').click();
  assert.match(await page.locator('#modal').innerText(),/RG2 GRIPPER TEST/);
  await page.evaluate(()=>window.rqContactAboutListing('seller:gripper-fixture','offer'));
  assert(await page.locator('#rqAskForm textarea').isVisible(),'buyer can compose a real in-app message');
  if(process.env.CI)await page.screenshot({path:path.join(screenshotDir,'roboquo-buyer-inquiry-desktop.png'),fullPage:true});
  await page.evaluate(()=>window.closeModal());
  if(process.env.CI){
    await page.screenshot({path:path.join(screenshotDir,'roboquo-market-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(screenshotDir,'roboquo-market-mobile.png'),fullPage:true});
  }
  await page.evaluate(()=>window.rqStartSell('part'));
  assert(await page.locator('#rqQuickSellForm').isVisible(),'short photo-first sell form opens');
  assert.equal(await page.locator('#rqQuickSellForm select[name="itemCategory"]').inputValue(),'part');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64');
  await page.locator('#rqClPhotos').setInputFiles({name:'part.png',mimeType:'image/png',buffer:png});
  await page.locator('#rqQuickSellForm [name=model]').fill('FANUC gear TEST');
  await page.locator('#rqQuickSellForm [name=location]').fill('Tokyo');
  await page.locator('#rqQuickSellForm [name=description]').fill('Real spare part with serial number, photos and condition');
  await page.locator('#rqQuickSellForm [name=companyName]').fill('Fixture Seller');
  await page.locator('#rqQuickSellForm [name=contactEmail]').fill('fixture@example.invalid');
  await page.locator('#rqQuickSellForm [name=contactPhone]').fill('+81 90 1234 5678');
  await page.locator('#rqQuickSellForm [name=declared]').check();
  await page.locator('#rqClSubmit').click();
  assert.match(await page.locator('#rqClStatus').innerText(),/Preview|preview|live database/i,'Preview upload must remain blocked before production');
  assert.equal(errors.length,0,'uncaught runtime errors: '+errors.join(' | '));
  console.log('PASS marketplace: real robots+parts, category/search, buyer chat form, photo upload preview guard');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(closeServer);
