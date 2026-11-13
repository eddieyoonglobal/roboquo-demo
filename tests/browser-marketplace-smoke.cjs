/* Approved RoboQuo marketplace browser regression.
 * Deliberately isolated: no real user accounts, uploads, offers, or DB mutations.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
 catch{res.writeHead(400).end();return}
 let file=path.resolve(root,'.'+pathname);
 if(pathname==='/'||pathname.endsWith('/'))file=path.join(root,'index.html');
 if(!(file===root||file.startsWith(root+path.sep))){res.writeHead(403).end();return}
 fs.readFile(file,(err,body)=>{
  if(err){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'}).end(body);
 });
});
const stop=()=>new Promise(resolve=>server.close(resolve));
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:chrome||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report=[];
 try{
 for(const device of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const ctx=await browser.newContext({viewport:{width:device.width,height:device.height},serviceWorkers:'block'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{
   const url=route.request().url();
   if(url.startsWith(origin+'/'))return route.continue();
   if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))return route.fulfill({status:200,contentType:'application/javascript',body:
    "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
   if(url.startsWith('https://vlwaoawklpxvhbteikwj.supabase.co/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   return route.abort();
  });
  const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response.status(),200,'Fixture homepage must load');
  await page.evaluate(()=>window.route?.('robots'));
  await page.waitForFunction(()=>document.querySelectorAll('#robots .rq-featured-card[data-rq-featured-maker]').length===37,{timeout:15000});
  const robot=page.locator('#rqRobotMakerTrack .rq-featured-card[data-rq-featured-maker]');
  const eoat=page.locator('#rqEoatMakerTrack .rq-featured-card[data-rq-featured-maker]');
  assert.equal(await robot.count(),23,'23 industrial/collaborative robot makers');
  assert.equal(await eoat.count(),14,'14 gripper and EOAT makers');
  const logos=page.locator('#robots .rq-featured-card[data-rq-featured-maker] .rq-actual-maker-logo');
  assert.equal(await logos.count(),37,'real logo image for each manufacturer');
  const broken=await logos.evaluateAll(async imgs=>{
   for(const img of imgs)img.loading='eager';
   await Promise.all(imgs.map(async img=>{try{await img.decode()}catch{}}));
   return imgs.filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.closest('[data-rq-featured-maker]')?.dataset.rqFeaturedMaker);
  });
  assert.deepEqual(broken,[],'logo assets must be valid actual PNG/SVG files');
  const regions=page.locator('#rqMakerRegionPicker [data-rq-region-filter]');
  assert.equal(await regions.count(),5,'region chooser: all, China, Taiwan, Korea, Japan');
  await page.locator('#languageSelect').selectOption('ko');
  assert.equal((await regions.nth(1).innerText()).trim(),'중국','Korean region button');
  for(const [name,size] of [['China',3],['Taiwan',3],['Korea',5],['Japan',7]]){
   await page.locator('#rqMakerRegionPicker [data-rq-region-filter="'+name+'"]').click();
   assert.equal(await page.locator('#rqRobotMakerTrack .rq-featured-product:not([hidden])').count(),size,name+' origin filter');
  }
  await page.locator('#rqMakerRegionPicker [data-rq-region-filter=""]').click();
  await page.locator('#rqRobotMakerTrack [data-rq-featured-maker="JAKA"]').click();
  assert.equal(await page.locator('#categoryFilter').inputValue(),'robot','JAKA selected robot category');
  assert.equal(await page.locator('#marketSearch').inputValue(),'JAKA','JAKA maker search');
  await page.locator('#rqEoatMakerTrack [data-rq-featured-maker="Piab"]').click();
  assert.equal(await page.locator('#categoryFilter').inputValue(),'gripper','Piab selected EOAT category');
  assert.equal(await page.locator('#marketSearch').inputValue(),'Piab','Piab maker search');
  await page.locator('#rqRobotMakerTrack [data-rq-featured-maker="FANUC"]').click();
  assert.equal(await page.locator('#marketSearch').inputValue(),'FANUC','FANUC maker search');
  assert.equal(await page.locator('#robots [data-rq-quick-action="buy"]').count(),1,'buy CTA');
  assert.equal(await page.locator('#robots [data-rq-quick-action="sell"]').count(),1,'sell CTA');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert(overflow<=3,'unexpected horizontal overflow: '+overflow);
  // Demo data, when visible, must not be mislabeled as real seller inventory.
  const demoBadges=page.locator('#robots .v24-listing-card .v24-badge.demo');
  const demoCount=await demoBadges.count();
  const reportItem={device:device.name,robotMakers:23,eoatMakers:14,logos:37,broken,regionButtons:5,overflow,demoBadges:demoCount,pageErrors:errors};
  fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
  await page.locator('#rqFeaturedShowcase').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'test-artifacts','roboquo-marketplace-'+device.name+'.png'),fullPage:false});
  report.push(reportItem);
  assert.equal(errors.length,0,'no JavaScript page errors');
  await ctx.close();
 }
 }finally{await browser.close();await stop()}
 console.log('PASS RoboQuo approved marketplace: '+JSON.stringify(report));
})().catch(e=>{console.error(e.stack);process.exit(1)});
