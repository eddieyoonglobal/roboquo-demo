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
  assert(await page.locator('#robots').isVisible(),'marketplace must be first page');
  assert(await page.locator('#rqBrowseShortcut').isVisible(),'first screen offers a visible Buy action');
  assert(await page.locator('#rqSellShortcut').isVisible(),'first screen offers a visible Sell action');
  assert.match(await page.locator('#rqBrowseShortcut').innerText(),/Find an item/);
  assert.match(await page.locator('#rqSellShortcut').innerText(),/Sell an item/);

  // All available locale selectors must localize the actual Buy/Sell entry points.
  for(const [language,buy,sell,gripper,countryAll,japanName] of [
    ['ko','상품 찾기','상품 팔기','그리퍼·EOAT','전체 국가','일본'],
    ['ja','商品を探す','商品を売る','グリッパー・EOAT','すべての国','日本'],
    ['zh','查找商品','发布商品','夹爪与EOAT','所有国家','日本'],
    ['de','Artikel finden','Artikel verkaufen','Greifer / EOAT','Alle Länder','Japan'],
    ['fr','Trouver un article','Vendre un article','Préhenseur / EOAT','Tous pays','Japon']
  ]){
    await page.locator('#languageSelect').selectOption(language);
    await page.waitForFunction(([expected])=>document.querySelector('#rqBrowseShortcut strong')?.textContent===expected,[buy]);
    assert.match(await page.locator('#rqSellShortcut').innerText(),new RegExp(sell));
    await page.evaluate(()=>route('robots'));
    assert.match(await page.locator('#rqMarketCategoryChips').innerText(),new RegExp(gripper));
    assert.equal((await page.locator('#countryFilter option').first().textContent()).trim(),countryAll,'localized country filter '+language);
    assert.equal((await page.locator('#countryFilter option[value="Japan"]').textContent()).trim(),japanName,'localized Japan option '+language);
  }
  await page.locator('#languageSelect').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#rqBrowseShortcut strong')?.textContent==='Find an item');
  assert.equal(await page.locator('#robots .v24-market-note').count(),0,'duplicated market notice removed');

  // Manufacturer data uses reviewed static seed only; no live DB writes.
  await page.evaluate(()=>route('makers'));
  await page.waitForFunction(()=>document.querySelectorAll('#makerGrid .maker-card').length>=40,{timeout:15000});
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'collaborative','manufacturer catalog starts with cobots');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),40,'curated cobot list contains 40 brands');
  assert.match(await page.locator('#rqCobotTitle').innerText(),/collaborative robot brands/i);
  for(const maker of ['UFACTORY','RealMan Robotics','DUCO Robots','Productive Robotics','OMRON Robotics','Kawasaki Robotics']){
    assert(await page.locator('#makerGrid .maker-card').filter({hasText:maker}).count()>0,'cobot brand included: '+maker);
  }
  assert.equal(await page.locator('#makerGrid .maker-card').filter({hasText:'Tesollo'}).count(),0,'gripper maker must not appear as cobot OEM');
  assert.equal(await page.locator('#makerGrid .maker-card').filter({hasText:'Vention'}).count(),0,'automation platform must not appear as cobot OEM');
  await page.locator('#rqMakerRegionLinks button[data-rq-maker-region="China"]').click();
  assert.equal(await page.locator('#makerRegionFilter').inputValue(),'China','regional chips synchronize with filter');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),13,'Chinese collaborative brands filtered');
  await page.locator('#makerSearch').fill('xArm');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),1,'series search finds UFACTORY');
  assert.match(await page.locator('#makerGrid .maker-card').first().innerText(),/UFACTORY/);
  assert.match(await page.locator('#makerGrid .rq-maker-official-link').first().getAttribute('href'),/^https:\/\//,'manufacturer cards link to official website');
  await page.locator('#makerSearch').fill('does-not-exist-cobot');
  assert.match(await page.locator('#makerGrid .rq-maker-empty').innerText(),/No manufacturer matches/);
  await page.locator('#makerSearch').fill('');
  await page.locator('#rqAllRobotMakers').click();
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'','all-brands action resets only robot type');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),45,'all China robot makers including additional verified brands');
  await page.locator('#makerRegionFilter').selectOption('');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),148,'full robot manufacturer directory loads without duplicates');
  await page.locator('[data-maker-tab="eoat"]').click();
  assert.equal(await page.locator('#makerGrid .maker-card').filter({hasText:'Tesollo'}).count(),1,'Tesollo appears in end effector maker directory');
  await page.locator('[data-maker-tab="robot"]').click();
  await page.locator('#rqCobotOnly').click();
  assert.equal(await page.locator('#makerGrid .maker-card').count(),40,'cobot shortcut returns to collaborative brand list');
  await page.locator('#languageSelect').selectOption('ja');
  await page.waitForFunction(()=>document.querySelector('#rqCobotOnly')?.textContent==='協働ロボット');
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'collaborative','language change preserves cobot selection');
  await page.locator('#languageSelect').selectOption('en');
  await page.evaluate(()=>route('robots'));

  await page.locator('#rqBrowseShortcut').click();
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'marketSearch','Buy should focus item search');
  await page.locator('#rqSellShortcut').click();
  assert(await page.locator('#rqQuickSellForm').isVisible(),'Sell shortcut must open photo-first listing form');
  await page.evaluate(()=>window.closeModal());

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
    {id:'seller:robot-fixture',backendId:'robot-fixture',brand:'FANUC',model:'CRX TEST',year:2024,location:'Shanghai',country:'China',
      price:19000,currency:'CNY',sale:'fixed',cat:'industrial',itemCategory:'robot',itemCondition:'new',sellerType:'business',description:'New robot from Chinese dealer',
      apps:[],hours:'—',operatingStatus:'stored',sellerCompany:'Fixture Company',verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{},photoCount:1},
    {id:'seller:gripper-fixture',backendId:'gripper-fixture',brand:'OnRobot',model:'RG2 GRIPPER TEST',location:'Osaka',country:'Japan',
      price:48000,currency:'JPY',sale:'fixed',cat:'gripper',itemCategory:'gripper',itemCondition:'used',sellerType:'individual',description:'Actual used gripper fixture',
      apps:[],hours:'—',operatingStatus:'unknown',sellerCompany:'Parts Fixture Seller',verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{},photoCount:1}
  ]));
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'only 2 real seller fixtures are visible');
  assert.match(await page.locator('#rqMarketResultCount').innerText(),/Showing 2 of 2 listings/,'fixture-only results count');
  assert.equal(await page.locator('#marketListings .v24-badge.demo').count(),0,'no DEMO cards shown');
  await page.locator('#rqMarketCategoryChips button[data-filter="gripper"]').click();
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'gripper category works');
  await page.locator('#categoryFilter').evaluate(el=>{el.value='';el.dispatchEvent(new Event('change',{bubbles:true}));});
  await page.locator('#conditionFilter').selectOption('new');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'new goods filter must exclude used grippers');
  assert.match(await page.locator('#marketListings .v24-listing-card').first().innerText(),/CN¥19,000/,'China listings show CNY price not JPY');
  await page.locator('#countryFilter').selectOption('China');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'China-only filter works');
  await page.locator('#countryFilter').selectOption('Japan');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'country and condition combine');
  await page.locator('#conditionFilter').selectOption('used');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'used Japanese parts filter works');
  await page.locator('#countryFilter').selectOption('');
  await page.locator('#categoryFilter').evaluate(el=>{el.value='gripper';el.dispatchEvent(new Event('change',{bubbles:true}));});
  await page.locator('#marketSearch').fill('NONEXISTENT-ROBOT-000');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'search filters real listings');
  assert.match(await page.locator('#marketListings .rq-market-empty h3').innerText(),/No matching listings/,'filtered zero state is distinct from empty inventory');
  assert(await page.locator('#rqMarketReset').isVisible(),'clear filters appears when filters are active');
  await page.locator('#rqMarketReset').click();
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'reset restores all real listings');
  assert(!(await page.locator('#rqMarketReset').isVisible()),'reset control hides when filters are clear');
  await page.locator('#marketSearch').fill('중고 그리퍼');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'Korean used gripper terms locate English seller listing');
  await page.locator('#marketSearch').fill('中古 グリッパー');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'Japanese used gripper terms locate English seller listing');
  await page.locator('#marketSearch').fill('新品 ロボット');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'Japanese new robot terms locate English seller listing');
  await page.locator('#marketSearch').fill('中古 ロボット');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'mixed-language terms must not match unrelated products');
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
    assert(await page.locator('#rqBrowseShortcut').isVisible(),'mobile Buy shortcut must be visible');
    assert(await page.locator('#rqSellShortcut').isVisible(),'mobile Sell shortcut must be visible');
    await page.screenshot({path:path.join(screenshotDir,'roboquo-market-mobile.png'),fullPage:true});
  }
  await page.evaluate(()=>window.rqStartSell('part'));
  assert(await page.locator('#rqQuickSellForm').isVisible(),'short photo-first sell form opens');
  assert.equal(await page.locator('#rqQuickSellForm select[name="itemCategory"]').inputValue(),'part');
  await page.locator('#rqClCountry').selectOption('China');
  assert.equal(await page.locator('#rqClCurrency').inputValue(),'CNY','China seller currency should follow country');
  await page.locator('#rqQuickSellForm [name="sellerType"]').selectOption('business');
  await page.locator('#rqClCountry').selectOption('Japan');
  assert.equal(await page.locator('#rqClCurrency').inputValue(),'JPY','Japan seller currency should follow country');
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
