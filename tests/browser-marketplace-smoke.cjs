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
  // Actual landmark products — clearly separated from uploaded seller inventory.
  assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-product').count(),15,'fifteen representative robot manufacturers in the first row');
  assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-card>img[data-rq-photo-fallback]').count(),6,'six freely reusable real robot photographs are configured');
  assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-credit').count(),15,'every robot card has a source or an explicit illustration note');
  assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-brand-mark img').count(),3,'three source-verified manufacturer wordmarks are displayed');
  assert.equal(await page.locator('#rqEoatShowcase .rq-featured-product').count(),14,'second row has fourteen gripper and EOAT manufacturers');
  assert.equal(await page.locator('#rqEoatShowcase .rq-featured-credit').count(),14,'every EOAT maker card has a source or an explicit illustration label');
  assert.equal(await page.locator('#rqEoatShowcase .rq-featured-card[data-rq-featured-kind="eoat"]').count(),14,'gripper card searches EOAT directory, not robot arm directory');
  assert.equal(await page.locator('#rqEoatShowcase img[src$="rq-vacuum-eoat.svg"]').count(),3,'vacuum EOAT uses a clearly labeled generic vacuum illustration');
  assert.equal(await page.locator('#rqEoatShowcase img[src$="rq-robotic-hand.svg"]').count(),3,'robotic hand makers use a clearly labeled generic hand illustration');
  assert.equal(await page.locator('#rqEoatShowcase img[src*="commons.wikimedia.org"]').count(),0,'unlicensed gripper marketing photographs must not be represented as approved OEM photos');
  assert.equal(await page.locator('#rqEoatShowcase [data-rq-featured-maker="OnRobot"] img[src$="rq-gripper.svg"]').count(),1,'OnRobot uses an illustration until approved images are available');
  const featuredMakers=await page.locator('#rqFeaturedShowcase .rq-featured-card').evaluateAll(els=>els.map(el=>el.dataset.rqFeaturedMaker));
  assert.deepEqual(featuredMakers,['FANUC','Yaskawa','Universal Robots','ABB Robotics','KUKA','Kawasaki Robotics','DENSO Robotics','Doosan Robotics','Nachi-Fujikoshi','OMRON Robotics','Epson Robots','Stäubli Robotics','Comau','Rainbow Robotics','HD Hyundai Robotics'],'hero spotlights only reviewed non-Chinese makers');
  assert.equal(await page.locator('#rqFeaturedShowcase [data-rq-featured-maker="Yaskawa"] img[data-rq-photo-fallback]').count(),1,'Yaskawa real image with offline fallback is configured');
  assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/data-rq-featured-maker="Yaskawa"[\s\S]{0,220}Welding_Robot_resized\.jpg/,'Yaskawa real photo source is maintained even when CI deliberately blocks external images');
  assert.equal(await page.locator('#rqFeaturedShowcase [data-rq-featured-maker="KUKA"] img[data-rq-photo-fallback]').count(),1,'KUKA real image with offline fallback is configured');
  assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/data-rq-featured-maker="KUKA"[\s\S]{0,220}KUKA_Robot_and_Target\.jpg/,'KUKA real photo source is maintained even when CI deliberately blocks external images');
  assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-credit[href*="commons.wikimedia.org/wiki/File:"]').count(),6,'all six real-photo cards link to original photo and usage terms');
  assert.match(await page.locator('#rqFeaturedNote').innerText(),/not items for sale/i,'reference photos must not be claimed as stock');
  await page.locator('#rqFeaturedShowcase [data-rq-featured-maker="FANUC"]').click();
  assert(await page.locator('#makers').isVisible(),'selected representative photo opens manufacturer directory');
  assert.equal(await page.locator('#makerSearch').inputValue(),'FANUC','FANUC photo locates FANUC manufacturer');
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'','featured industrial manufacturers are not restricted to collaborative robots');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),1,'FANUC manufacturer search narrows directory');
  await page.evaluate(()=>route('robots'));
  await page.locator('#rqEoatShowcase [data-rq-featured-maker="OnRobot"]').click();
  assert(await page.locator('#makers').isVisible(),'OnRobot artwork opens EOAT makers');
  assert(await page.locator('[data-maker-tab="eoat"]').evaluate(el=>el.classList.contains('active')),'OnRobot is an EOAT maker, not a robot arm OEM');
  assert.equal(await page.locator('#makerSearch').inputValue(),'OnRobot','OnRobot profile is searched');
  await page.evaluate(()=>route('robots'));
  await page.locator('#rqEoatShowcase [data-rq-featured-maker="Tesollo"]').click();
  assert(await page.locator('[data-maker-tab="eoat"]').evaluate(el=>el.classList.contains('active')),'Korean dexterous hand brand navigates EOAT directory');
  assert.equal(await page.locator('#makerSearch').inputValue(),'Tesollo','seller can find actual Tesollo maker directory entry');
  assert.equal(await page.locator('#makerGrid .maker-card').count(),1,'new EOAT gallery card finds a real indexed manufacturer');
  await page.locator('[data-maker-tab="robot"]').click();
  await page.locator('#makerSearch').fill('');
  await page.locator('#makerTypeFilter').selectOption('collaborative'); // Restore cobot default for unrelated catalog smoke tests.
  await page.evaluate(()=>route('robots'));


  assert.equal(await page.locator('#robots .rq-market-heading-photo img').count(),1,'first visible market screen has a real factory robot photograph');
  assert.equal(await page.locator('#rqBrowseShortcut img.rq-market-action-thumb').count(),1,'buy card has an equipment image');
  assert.equal(await page.locator('#rqSellShortcut img.rq-market-action-thumb').count(),1,'sell card has an equipment image');
  assert.equal(await page.locator('#robots .rq-market-discovery-card').count(),3,'first marketplace route offers three illustrated categories');
  await page.locator('#robots .rq-market-discovery-card[data-rq-market-category="gripper"]').click();
  const marketVisualDebug=await page.evaluate(()=>({value:document.getElementById('categoryFilter')?.value,options:[...document.getElementById('categoryFilter').options].map(o=>o.value),render:typeof window.rqRenderMarketplace,route:typeof window.route,active:document.querySelector('#robots .rq-market-discovery-card[aria-pressed="true"]')?.dataset.rqMarketCategory}));
  assert.equal(await page.locator('#categoryFilter').inputValue(),'gripper','market visual category selects actual gripper filter: '+JSON.stringify(marketVisualDebug));
  assert.equal(await page.locator('#robots .rq-market-discovery-card[data-rq-market-category="gripper"]').getAttribute('aria-pressed'),'true','selected visual category is visibly active');
  await page.locator('#rqVisualClear').click();
  assert.equal(await page.locator('#categoryFilter').inputValue(),'','clear visible category filter returns all items');
  assert.equal(await page.locator('#robots .rq-market-discovery-card[aria-pressed="true"]').count(),0,'no category remains highlighted after clearing');

  assert.equal(await page.locator('.site-header img.rq-site-logo').count(),1,'original RoboQuo logo is visible in the header');

  await page.locator('.site-header a.brand').click();
  assert(await page.locator('#home').isVisible(),'RoboQuo brand logo opens photo-first home');
  await page.evaluate(()=>route('robots'));
  for(const name of ['rq-robot.svg','rq-gripper.svg','rq-parts.svg','rq-brand.svg']){
    const response=await page.evaluate(n=>fetch('./assets/'+n).then(r=>({ok:r.ok,contentType:r.headers.get('content-type')})),name);
    assert(response.ok&&response.contentType.includes('svg'),'valid local visual asset: '+name);
  }

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
    if(language==='ja'||language==='ko'){
      await page.waitForFunction(l=>document.querySelector('#rqMarketDiscoveryTitle')?.textContent === (l==='ja'?'写真から、もっと簡単に探す。':'사진으로 보고, 쉽게 찾으세요.'),language);
      assert.equal(await page.locator('#robots .rq-market-discovery-card').count(),3,'localized visual equipment menu '+language);
    }

    await page.waitForFunction(([expected])=>document.querySelector('#rqBrowseShortcut strong')?.textContent===expected,[buy]);
    assert.match(await page.locator('#rqSellShortcut').innerText(),new RegExp(sell));
    await page.evaluate(()=>route('robots'));
    assert.match(await page.locator('#rqMarketCategoryChips').innerText(),new RegExp(gripper));
    assert.equal((await page.locator('#countryFilter option').first().textContent()).trim(),countryAll,'localized country filter '+language);
    assert.equal((await page.locator('#countryFilter option[value="Japan"]').textContent()).trim(),japanName,'localized Japan option '+language);
  }
  await page.locator('#languageSelect').selectOption('ja');
  await page.waitForFunction(()=>document.querySelector('#rqFeaturedTitle')?.textContent==='代表ロボットメーカー');
  await page.locator('#languageSelect').selectOption('ko');
  await page.waitForFunction(()=>document.querySelector('#rqFeaturedTitle')?.textContent==='대표 로봇 메이커');
  await page.locator('#languageSelect').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#rqBrowseShortcut strong')?.textContent==='Find an item');
  assert.equal(await page.locator('#robots .v24-market-note').count(),0,'duplicated market notice removed');

  await page.evaluate(()=>route('home'));
  assert.equal(await page.locator('#rqVisualMarket .rq-visual-market-card').count(),3,'homepage has 3 visual equipment categories');
  await page.locator('#home .rq-visual-market-card[data-rq-market-category="gripper"]').click();
  assert(await page.locator('#robots').isVisible(),'visual navigation returns to market');
  assert.equal(await page.locator('#categoryFilter').inputValue(),'gripper','visual gripper card synchronizes actual market category filter');
  await page.evaluate(()=>route('home'));
  await page.locator('#languageSelect').selectOption('ja');
  await page.waitForFunction(()=>document.querySelector('#rqVisualMarketTitle')?.textContent?.includes('写真から'));
  assert.match(await page.locator('#home [data-rq-label="gripper"]').innerText(),/グリッパー/,'Japanese visual category labels');
  await page.locator('#languageSelect').selectOption('en');
  await page.evaluate(()=>route('robots'));


  // Manufacturer data uses reviewed static seed only; no live DB writes.
  await page.evaluate(()=>route('makers'));
  await page.waitForFunction(()=>document.querySelectorAll('#makerGrid .maker-card').length>=40,{timeout:15000});
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'collaborative','manufacturer catalog starts with cobots');

  assert.equal(await page.locator('#makerGrid .maker-card img.rq-maker-thumb').count(),40,'directory gives every cobot maker a recognizable illustrative image');

  assert.match(await page.locator('#rqJumpCompare').innerText(),/Compare verified model specs/);
  await page.locator('#rqJumpCompare').click();
  assert(await page.locator('#rqCobotCompare').isVisible(),'model comparison jump reaches a visible section');

  // Manufacturer-sourced cobot specs: no fabricated catalog entries, sales stock or database writes.
  await page.waitForFunction(()=>document.querySelectorAll('#rqCompareModels .rq-spec-card').length===10,{timeout:15000});
  assert.equal(await page.locator('#rqCompareModels .rq-spec-card').count(),10,'ten official-source cobot models loaded');

  assert.equal(await page.locator('#rqCompareModels .rq-model-photo').count(),10,'each comparison card has a model-neutral illustration');
  assert.match(await page.locator('#rqCompareModels .rq-model-image-note').first().innerText(),/Illustration/,'visuals are explicitly not OEM product photos');

  assert.match(await page.locator('#rqCompareDescription').innerText(),/No live inventory/i);
  const fanucSpec=page.locator('#rqCompareModels .rq-spec-card').filter({hasText:'CRX-10iA'});
  assert.match(await fanucSpec.innerText(),/10 kg/,'FANUC payload recorded');
  assert.match(await fanucSpec.innerText(),/1249 mm/,'FANUC reach recorded');
  assert.match(await fanucSpec.locator('a.rq-spec-source').getAttribute('href'),/^https:\/\//,'real official specification links required');
  await fanucSpec.locator('button.rq-compare-toggle').click();
  await page.locator('#rqCompareModels .rq-spec-card').filter({hasText:'UR5e'}).locator('button.rq-compare-toggle').click();
  assert.equal(await page.locator('#rqCompareTableScroll table').count(),1,'side-by-side table appears after selecting two models');
  assert.match(await page.locator('#rqCompareTableScroll').innerText(),/FANUC.*CRX-10iA|CRX-10iA/,'comparison table preserves manufacturer and model');
  await page.locator('#rqCompareModels .rq-spec-card').filter({hasText:'M0609'}).locator('button.rq-compare-toggle').click();
  assert.equal(await page.locator('#rqCompareTableScroll thead th').count(),4,'comparison limited to three model columns');
  assert(await page.locator('#rqCompareModels .rq-spec-card').filter({hasText:'Zu7'}).locator('button.rq-compare-toggle').isDisabled(),'fourth model cannot be selected');
  await page.locator('#rqCompareClear').click();
  assert.equal(await page.locator('#rqCompareTableScroll table').count(),0,'clear comparison resets table');
  await page.locator('#rqCompareBrand').selectOption('JAKA Robotics');
  assert.equal(await page.locator('#rqCompareModels .rq-spec-card').count(),3,'manufacturer filter returns only verified JAKA models');
  await page.locator('#rqComparePayload').selectOption('10');
  assert.equal(await page.locator('#rqCompareModels .rq-spec-card').count(),1,'minimum payload filter removes smaller JAKA models');
  assert.match(await page.locator('#rqCompareModels .rq-spec-card').innerText(),/Zu12/);
  await page.locator('#rqCompareBrand').selectOption('');
  await page.locator('#rqComparePayload').selectOption('0');
  await page.locator('#rqCompareSort').selectOption('reach-desc');
  assert.match(await page.locator('#rqCompareModels .rq-spec-card').first().innerText(),/UR20-1750/,'longest reach sorting puts UR20 first');
  await page.locator('#rqCompareSort').selectOption('brand');

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
  assert.equal(await page.locator('#makerGrid .maker-card').count(),17,'full EOAT manufacturer directory includes eight new verified regional companies');
  await page.locator('[data-maker-tab="robot"]').click();
  await page.locator('#rqCobotOnly').click();
  assert.equal(await page.locator('#makerGrid .maker-card').count(),40,'cobot shortcut returns to collaborative brand list');
  await page.locator('#languageSelect').selectOption('ja');
  await page.waitForFunction(()=>document.querySelector('#rqCobotOnly')?.textContent==='協働ロボット');
  assert.match(await page.locator('#rqJumpCompare').innerText(),/公式仕様で機種を比較/,'comparison shortcut localizes to Japanese');
  assert.equal(await page.locator('#makerTypeFilter').inputValue(),'collaborative','language change preserves cobot selection');
  await page.locator('#languageSelect').selectOption('en');
  await page.evaluate(()=>route('robots'));

  await page.locator('#rqBrowseShortcut').click();
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'marketSearch','Buy should focus item search');
  await page.locator('#rqSellShortcut').click();
  assert(await page.locator('#rqQuickSellForm').isVisible(),'Sell shortcut must open photo-first listing form');
  await page.evaluate(()=>window.closeModal());

  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'no fake robot inventory is displayed');
  assert(await page.locator('#marketListings [data-rq-empty-action="brands"]').isVisible(),'empty real inventory offers brand directory navigation');
  await page.locator('#marketListings [data-rq-empty-action="brands"]').click();
  assert(await page.locator('#makers').isVisible(),'empty state navigates to real manufacturer directory');
  await page.evaluate(()=>route('robots'));
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
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{extra1:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="21" height="20"%3E%3C/svg%3E',extra2:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="22" height="20"%3E%3C/svg%3E'},photoCount:3},
    {id:'seller:gripper-fixture',backendId:'gripper-fixture',brand:'OnRobot',model:'RG2 GRIPPER TEST',location:'Osaka',country:'Japan',
      price:48000,currency:'JPY',sale:'fixed',cat:'gripper',itemCategory:'gripper',itemCondition:'used',sellerType:'individual',description:'Actual used gripper fixture',
      apps:[],hours:'—',operatingStatus:'unknown',sellerCompany:'Parts Fixture Seller',verified:false,demo:false,_source:'seller-supabase',
      media:{nameplate:false,controller:false,video:false},
      photoUrl:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3C/svg%3E',photoUrls:{},photoCount:1}
  ]));
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'only 2 real seller fixtures are visible');
  // Buyer should see every uploaded real seller photo, not only the cover.
  await page.locator('#marketListings .v24-listing-card').first().locator('.v24-photo').click();
  assert(await page.locator('#v24MainImage').isVisible(),'seller product details open');
  assert.equal(await page.locator('#modal .v24-thumb').count(),3,'cover and additional two seller photos appear in gallery');
  await page.locator('#modal .v24-thumb[data-view="extra2"]').click();
  assert.match(await page.locator('#v24MainImage img').getAttribute('src'),/width="22"/,'third photo switches the main product image');
  await page.evaluate(()=>window.closeModal());

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
  assert(await page.locator('#marketListings [data-rq-empty-action="clear"]').isVisible(),'filtered empty state offers clear-filters action');
  assert(await page.locator('#rqMarketReset').isVisible(),'clear filters appears when filters are active');
  await page.locator('#rqMarketReset').click();
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'reset restores all real listings');
  assert.equal(await page.locator('#robots .rq-market-discovery-card[aria-pressed="true"]').count(),0,'reset must clear stale highlighted photo category even when filter reset skipped change event');
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
    assert(await page.locator('#rqMobileQuery').isVisible(),'mobile search is present at top');
    assert.equal(await page.locator('#rqMobileMarketPills button').count(),4,'mobile has four quick filters');
    assert(!(await page.locator('#robots .rq-market-heading').isVisible()),'long desktop heading is hidden on mobile');
    assert(!(await page.locator('#rqMarketQuickStart').isVisible()),'large duplicate buy and sell actions are hidden on mobile');
    assert.equal(await page.locator('#robots .rq-market-discovery-card').count(),3,'mobile shows exactly three pictorial equipment categories');
    await page.locator('#rqMobileQuery').fill('RG2');
    assert.equal(await page.locator('#marketSearch').inputValue(),'RG2','mobile query synchronizes with real market search');
    assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'mobile search filters actual seller rows');
    await page.locator('#rqMobileReset').click();
    assert.equal(await page.locator('#marketSearch').inputValue(),'','mobile clear button resets search');
    await page.locator('[data-rq-mobile-condition="used"]').click();
    assert.equal(await page.locator('#conditionFilter').inputValue(),'used','mobile used chip updates condition filter');
    assert.equal(await page.locator('#marketListings .v24-listing-card').count(),1,'used chip excludes new robot fixture');
    await page.locator('[data-rq-mobile-condition=""]').click();
    assert.equal(await page.locator('#conditionFilter').inputValue(),'','all-items chip clears condition');
    assert.equal(await page.locator('#marketListings .v24-listing-card').count(),2,'all-items chip restores both real fixture listings');
    const cardColumnCount=await page.locator('#marketListings').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(cardColumnCount,2,'mobile cards use a two-column photo-first grid');
    assert(!(await page.locator('#conditionFilter').isVisible()),'mobile hides duplicate condition dropdown because used/new chips already filter');
    const listingVisible=await page.locator('#marketListings .v24-listing-card').first();
    assert(!(await listingVisible.locator('.v24-meta-row').isVisible()),'mobile hides secondary metadata for compact card');
    assert(await listingVisible.locator('.v24-card-price strong').isVisible(),'mobile card keeps real price visible');
    assert(await listingVisible.locator('.v24-actions .buy').isVisible(),'mobile card retains buyer inquiry action');
    const searchTop=await page.locator('#rqMobileQuery').boundingBox();
    const pictureTop=await page.locator('#robots .rq-market-discovery-card').first().boundingBox();
    const featureTop=await page.locator('#rqFeaturedShowcase').boundingBox();
    assert(featureTop&&searchTop&&pictureTop&&searchTop.y<featureTop.y&&featureTop.y<pictureTop.y,'mobile shows search, representative robot photos, then equipment categories');
    assert.equal(await page.locator('#rqFeaturedShowcase .rq-featured-card').count(),15,'mobile robot maker strip contains fifteen recognisable brands');
    const stripScrolling=await page.locator('#rqFeaturedShowcase .rq-featured-track').evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
    assert(stripScrolling.scrollWidth>stripScrolling.clientWidth,'mobile featured images scroll horizontally rather than overflow the page');
    assert.equal(await page.locator('#rqEoatShowcase .rq-featured-card').count(),14,'mobile gripper swipe strip has fourteen brands');
    const eoatScrolling=await page.locator('#rqEoatMakerTrack').evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
    assert(eoatScrolling.scrollWidth>eoatScrolling.clientWidth,'mobile gripper brands scroll in a second horizontal row');
    assert(await page.locator('#rqFeaturedShowcase .rq-maker-arrow').count()===2,'robot gallery exposes desktop-friendly left and right controls');
    assert(await page.locator('#rqEoatShowcase .rq-maker-arrow').count()===2,'gripper gallery exposes independent left and right controls');
    await page.locator('#rqEoatShowcase .rq-maker-arrow[data-rq-scroll="1"]').click();
    await page.waitForFunction(()=>document.getElementById('rqEoatMakerTrack')?.scrollLeft>100,{timeout:4000});
    assert(searchTop && pictureTop && searchTop.y<pictureTop.y,'mobile search precedes category image cards');
    assert(await page.locator('.mobile-nav').isVisible(),'bottom action bar remains visible');

    assert.equal(await page.locator('#robots .rq-market-discovery-card').count(),3,'mobile keeps equipment navigation');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert(overflow<=2,'market photo/category layout should not create horizontal overflow: '+overflow);

    assert(!(await page.locator('#rqBrowseShortcut').isVisible()),'mobile removes oversized Buy shortcut to prioritize search');
    assert(!(await page.locator('#rqSellShortcut').isVisible()),'mobile replaces oversized Sell shortcut with fixed bottom navigation');
    assert(await page.locator('.mobile-nav .sell-mobile').isVisible(),'mobile Sell action remains available in bottom nav');
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

  await page.goto(origin+'/review.html',{waitUntil:'domcontentloaded'});
  assert(await page.locator('.rq-review-visuals').isVisible(),'preview review guide contains actual robot and category visuals');
  assert.equal(await page.locator('.rq-review-visual-cats img').count(),3,'review page shows robot, gripper and parts');
  assert.equal(await page.locator('nav .logo img[src$="rq-brand.svg"]').count(),1,'review guide uses matching RoboQuo branding');
  assert.match(await page.locator('.rq-review-photo figcaption').innerText(),/Bobjgalindo.*CC BY 4.0/,'FANUC photo has correct photographer and license attribution');
  if(process.env.CI)await page.screenshot({path:path.join(screenshotDir,'roboquo-review-visual-guide.png'),fullPage:true});

  assert.equal(errors.length,0,'uncaught runtime errors: '+errors.join(' | '));
  console.log('PASS marketplace: real robots+parts, category/search, buyer chat form, photo upload preview guard');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(closeServer);
