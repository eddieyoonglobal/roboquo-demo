/* Chromium fixture-only test: AMR manufacturer discovery, never seller mutations. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 let name;
 try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
 let p=path.resolve(root,'.'+name);
 if(name==='/'||name.endsWith('/'))p=path.join(root,'index.html');
 if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(p,(err,body)=>{if(err){res.writeHead(404).end();return;}
 res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream','cache-control':'no-store'}).end(body);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:900},serviceWorkers:'block'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const url=route.request().url();
    if(url.startsWith(origin+'/'))return route.continue();
    if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))return route.fulfill({status:200,contentType:'application/javascript',
     body:"window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),getUser:async()=>({data:{user:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
    if(url.includes('.supabase.co/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    return route.abort();
   });
   await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelectorAll('#rqAmrTrack .rq-amr-maker').length===19,{timeout:15000});
   await page.evaluate(()=>window.route?.('robots'));
   assert.equal(await page.locator('#rqAmrTrack .rq-amr-item').count(),19);
   assert.equal(await page.locator('#rqAmrTrack .rq-amr-official').count(),19);
   assert.equal(await page.locator('#rqAmrRegions button').count(),6);
   const names=await page.locator('#rqAmrTrack .rq-amr-maker').evaluateAll(nodes=>nodes.map(x=>x.dataset.maker));
   assert.deepEqual(names.slice(0,2),['MiR','Tompkins Robotics']);
   const tiles=await page.locator('#rqAmrTrack .rq-amr-item').evaluateAll(nodes=>nodes.map(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));
   assert.equal(new Set(tiles.map(x=>x.w+'x'+x.h)).size,1,'equal card dimensions '+width);
   const safeLinks=await page.locator('#rqAmrTrack .rq-amr-official').evaluateAll(links=>links.every(x=>x.rel.includes('noopener')&&x.target==='_blank'&&x.href.startsWith('https://')));
   assert(safeLinks,'every official maker link is safe');
   await page.locator('#languageSelect').selectOption('ko');
   assert.equal((await page.locator('#rqAmrTitle').innerText()).trim(),'AMR·AGV·무인운반차 메이커');
   await page.locator('#rqAmrRegions [data-amr-region="Korea"]').click();
   assert.equal(await page.locator('#rqAmrTrack .rq-amr-item:visible').count(),2,'Korea makers');
   await page.locator('#rqAmrRegions [data-amr-region="Japan"]').click();
   assert.equal(await page.locator('#rqAmrTrack .rq-amr-item:visible').count(),7,'Japan makers');
   await page.locator('#rqAmrRegions [data-amr-region="Europe"]').click();
   assert.equal(await page.locator('#rqAmrTrack .rq-amr-item:visible').count(),3,'Europe makers');
   await page.locator('#rqAmrTrack .rq-amr-maker[data-maker="MiR"]').click();
   assert.equal(await page.locator('#marketSearch').inputValue(),'Mobile Industrial Robots','maker click must filter listings');
   assert.equal(await page.locator('#categoryFilter').inputValue(),'robot','AMR uses existing robot data category');
   assert.equal(errors.length,0,'unexpected JS errors '+width+' '+JSON.stringify(errors));
   console.log('PASS AMR browsing '+width+'px: 19 logos/fallbacks, five regions, real listing search');
   await page.close();
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
