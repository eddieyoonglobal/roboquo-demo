/* RoboQuo fee guide: no payments, no DB writes, and clear 50% introduction/agency discounts. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'}).end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const binary=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:binary||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:920},serviceWorkers:'block'});
  const page=await ctx.newPage();const pageErrors=[],dbWrites=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  await page.route('**/*',route=>{
   const url=route.request().url(),method=route.request().method();
   if(url.startsWith(base+'/'))return route.continue();
   if(url.includes('.supabase.co/')){
    if(!['GET','HEAD'].includes(method))dbWrites.push({url,method});
    return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   }
   if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))return route.fulfill({status:200,contentType:'application/javascript',body:
    "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
   return route.abort();
  });
  await page.goto(base+'/#fees',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('#rqFeesMount .rq-fees-card').length===3,{timeout:15000});
  assert.equal(await page.locator('#fees').isVisible(),true,'fees route must be visible');
  assert.equal(await page.locator('#rqFeesMount .rq-fees-card').count(),3);
  assert.equal(await page.locator('#rqFeeTitle').count(),1,'localized accessible heading');
  assert.equal(await page.locator('#rqFeeAmount').inputValue(),'1000000');
  const results=()=>page.locator('.rq-fees-result strong').allTextContents();
  assert.deepEqual((await results()).map(v=>v.trim()),['¥25,000','¥50,000','¥25,000'],'intro 2.5% vs standard 5%');
  await page.locator('#rqFeeType').selectOption('agency');
  assert.deepEqual((await results()).map(v=>v.trim()),['¥50,000','¥100,000','¥50,000'],'agency 5% vs standard 10%');
  await page.locator('#rqFeeType').selectOption('direct');
  assert.deepEqual((await results()).map(v=>v.trim()),['¥0','¥0','¥0'],'direct listing free');
  await page.locator('#rqFeeType').selectOption('intro');
  await page.locator('#rqFeeAmount').fill('3000000');
  assert.deepEqual((await results()).map(v=>v.trim()),['¥75,000','¥150,000','¥75,000'],'larger quote never FX-converted');
  await page.locator('#rqFeeAmount').fill('-4');
  assert.deepEqual((await results()).map(v=>v.trim()),['—','—','—'],'invalid input not shown as charge');
  await page.locator('#rqFeeAmount').fill('1000000');
  await page.locator('#languageSelect').selectOption('ja');
  await page.waitForFunction(()=>document.querySelector('#rqFeeTitle')?.textContent.includes('掲載は無料'));
  assert.match(await page.locator('#rqFeesMount').innerText(),/ローンチ記念 50％OFF/);
  assert.match(await page.locator('#rqFeesMount').innerText(),/自動決済・自動請求には対応していません/);
  await page.locator('#languageSelect').selectOption('ko');
  await page.waitForFunction(()=>document.querySelector('#rqFeeTitle')?.textContent.includes('무료로 시작'));
  assert.match(await page.locator('#rqFeesMount').innerText(),/별도 합의/);
  assert.match(await page.locator('#rqFeesMount').innerText(),/2.5%/);
  for(const lang of ['en','zh','de','fr','es','it','pt','vi']) {
   await page.locator('#languageSelect').selectOption(lang);
   await page.waitForFunction(l=>document.querySelector('#languageSelect')?.value===l,lang);
   assert.equal(await page.locator('.rq-fees-card').count(),3,'missing cards '+lang);
  }
  assert.equal(dbWrites.length,0,'fee guide must never write user or billing data');
  assert.equal(pageErrors.length,0,'fee page JS errors: '+JSON.stringify(pageErrors));
  await page.locator('#languageSelect').selectOption('ko');
  await page.evaluate(()=>route('about'));
  await page.locator('#about').waitFor({state:'visible'});
  await page.locator('[data-rq-fees-link]').click();
  assert.equal(await page.locator('#fees').isVisible(),true,'About fee link should open fee guide');
  console.log('PASS fee guide '+width+'px: free listing, 2.5/5 promo, 5/10 base, 10 locales, no charges');
  await ctx.close();
 }}finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
