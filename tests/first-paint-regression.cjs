/* Verify RoboQuo does not flash the former home before JS finishes. Fixture-only. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html;charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
 const p=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(p,(err,b)=>{if(err){res.writeHead(404).end();return;}
 res.writeHead(200,{'content-type':types[path.extname(p)]||'application/octet-stream','cache-control':'no-store'}).end(b);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:chrome||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let unblock;
  const delayed=new Promise(resolve=>{unblock=resolve});
  await page.route('**/*',async route=>{
   const url=route.request().url();
   if(url.startsWith(origin+'/')){
    if(url.includes('/v24.js'))await delayed;  // Hold the initial paint before hydration.
    return route.continue();
   }
   if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))
    return route.fulfill({status:200,contentType:'application/javascript',body:
     "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
   if(url.includes('.supabase.co/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   return route.abort();
  });
  try{
   await page.goto(origin+'/',{waitUntil:'commit'});
   await page.locator('#rqInitialShell').waitFor({state:'visible',timeout:12000});
   const before=await page.evaluate(()=>({
    boot:document.documentElement.classList.contains('rq-first-paint'),
    homeActive:document.getElementById('home').classList.contains('active'),
    robotActive:document.getElementById('robots').classList.contains('active'),
    homeDisplay:getComputedStyle(document.getElementById('home')).display,
    robotsDisplay:getComputedStyle(document.getElementById('robots')).display,
    shellDisplay:getComputedStyle(document.getElementById('rqInitialShell')).display,
    headerLogoVisible:getComputedStyle(document.querySelector('.site-header .brand')).visibility
   }));
   assert.equal(before.boot,true,'shell must be active while scripts are delayed');
   assert.equal(before.homeActive,false,'old homepage must not be active on initial HTML');
   assert.equal(before.robotActive,true,'marketplace must be selected in initial HTML');
   assert.equal(before.homeDisplay,'none','old home never painted');
   assert.equal(before.robotsDisplay,'none','unfinished marketplace also remains hidden');
   assert.notEqual(before.shellDisplay,'none','neutral loading skeleton visible');
   assert.equal(before.headerLogoVisible,'visible','logo remains visible during first paint');
  }finally{unblock();}
  await page.waitForFunction(()=>!document.documentElement.classList.contains('rq-first-paint'),{timeout:15000});
  await page.waitForFunction(()=>document.getElementById('robots').classList.contains('active'),{timeout:10000});
  assert.equal(await page.locator('#rqInitialShell').isVisible(),false,'skeleton disappears when ready');
  assert.equal(await page.locator('#home').isVisible(),false,'legacy homepage never becomes visible');
  assert.equal(await page.locator('#robots').isVisible(),true,'final marketplace becomes visible');
  assert.equal(errors.length,0,'unexpected browser errors at '+width+': '+JSON.stringify(errors));
  // A direct link must still display the requested page, not always force Marketplace.
  await page.goto(origin+'/#home',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('rq-first-paint'));
  assert.equal(await page.locator('#home').isVisible(),true,'explicit #home deep link preserved');
  assert.equal(await page.locator('#robots').isVisible(),false,'deep link shows only home');
  console.log('PASS first paint '+width+'px: legacy page hidden during delayed JS; marketplace first; #home preserved');
  await ctx.close();
 }}finally{await browser.close();await new Promise(done=>server.close(done));}
})().catch(err=>{console.error(err);process.exitCode=1});
