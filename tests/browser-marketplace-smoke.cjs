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
  await page.evaluate(()=>route('robots'));
  await page.locator('#marketSearch').fill('FANUC');
  assert((await page.locator('#marketListings .v24-listing-card').count())>=1,'known robot search should find a card');
  await page.locator('#marketSearch').fill('NO_SUCH_ROBOT_MODEL_ZZZ_1234');
  assert.equal(await page.locator('#marketListings .v24-listing-card').count(),0,'unknown model should show no results');
  await page.locator('#marketSearch').fill('');
  await page.evaluate(()=>window.rqStartSell());
  assert(await page.locator('#modal').isVisible(),'seller photo-first wizard should open');
  assert.equal(errors.length,0,'uncaught runtime errors: '+errors.join(' | '));
  console.log('PASS browser smoke: demo listing, local search, protected preview, sell wizard, no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(closeServer);
