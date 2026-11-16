/* RoboQuo first live product guide: seller remains in control. No DB writes in QA. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'}).end(b);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:chrome||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const width of [390,1440]){
   const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
   const page=await ctx.newPage(),dbWrites=[],errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const url=route.request().url(),method=route.request().method();
    if(/\.supabase\.co\//.test(url)){if(!['GET','HEAD'].includes(method))dbWrites.push({url,method});return route.fulfill({status:200,contentType:'application/json',body:'[]'});}
    if(url.startsWith(origin+'/'))return route.continue();
    if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js'))return route.fulfill({status:200,contentType:'application/javascript',body:
     "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
    return route.abort();
   });
   await page.goto(origin+'/?firstProduct=yaskawa-csra-sdb06ha',{waitUntil:'domcontentloaded'});
   await page.locator('#rqQuickSellForm').waitFor({timeout:10000});
   const data=await page.evaluate(()=>{
    const form=document.querySelector('#rqQuickSellForm');
    return {brand:form.querySelector('[name="maker"]').value,
     model:form.querySelector('[name="model"]').value,
     itemCategory:form.querySelector('[name="itemCategory"]').value,
     condition:form.querySelector('[name="itemCondition"]').value,
     country:form.querySelector('[name="country"]').value,
     location:form.querySelector('[name="location"]').value,
     phone:form.querySelector('[name="contactPhone"]').value,
     price:form.querySelector('[name="price"]').value,
     description:form.querySelector('[name="description"]').value,
     pictures:form.querySelector('[type="file"]').files.length,
     checked:form.querySelector('[name="declared"]').checked,
     preset:form.dataset.firstProduct,
     owner:form.querySelector('[name="companyName"]').value};
   });
   // The live directory contains all 165 active manufacturers, not just a short brand list.
   await page.waitForFunction(()=>document.querySelectorAll('#rqClMakerSelect option').length>=165,{timeout:10000});
   const makerValues=await page.locator('#rqClMakerSelect option').evaluateAll(opts=>opts.map(o=>o.value));
   assert(makerValues.includes('FANUC'),'FANUC remains selectable');
   assert(makerValues.includes('YASKAWA'),'YASKAWA maker alias remains selectable');
   assert(makerValues.includes('ABB Robotics'),'ABB remains selectable');
   assert(makerValues.includes('__other__'),'brand-not-listed option exists');
   const manufacturerCount=makerValues.filter(x=>x&&x!=='__other__').length;
   assert(manufacturerCount>=165,'all 165 active maker names must be selectable, got '+manufacturerCount);
   // Free text appears only when the seller chooses Other.
   await page.locator('#rqClMakerSelect').selectOption('__other__');
   assert.equal(await page.locator('#rqClMakerOther').isVisible(),true);
   assert.equal(await page.locator('#rqClMakerOther').getAttribute('required'),'');
   await page.locator('#rqClMakerOther').fill('New Custom Manufacturer');
   assert.equal(await page.locator('#rqClMakerOther').inputValue(),'New Custom Manufacturer');
   await page.locator('#rqClMakerSelect').selectOption('YASKAWA');
   assert.equal(await page.locator('#rqClMakerOther').isVisible(),false);
   // Currency is derived from country; no independent editable select.
   assert.equal(await page.locator('#rqClCurrency').getAttribute('type'),'hidden');
   assert.equal(await page.locator('#rqClCurrencyDisplay').isVisible(),true);
   await page.locator('#rqClCountry').selectOption('Japan');
   assert.equal(await page.locator('#rqClCurrency').inputValue(),'JPY');
   assert.match(await page.locator('#rqClPriceLabel').innerText(),/¥ JPY/);
   assert.match(await page.locator('#rqClCurrencyDisplay').innerText(),/¥ JPY/);
   await page.locator('[name="price"]').fill('3000000');
   await page.locator('#rqClCountry').selectOption('Korea');
   assert.equal(await page.locator('#rqClCurrency').inputValue(),'KRW');
   assert.equal(await page.locator('[name="price"]').inputValue(),'','old JPY amount cleared');
   assert.match(await page.locator('#rqClPriceLabel').innerText(),/₩ KRW/);
   assert.match(await page.locator('#rqClCurrencyDisplay').innerText(),/₩ KRW/);
   await page.locator('[name="price"]').fill('3000000');
   await page.locator('#rqClCountry').selectOption('Japan');
   assert.equal(await page.locator('#rqClCurrency').inputValue(),'JPY');
   assert.equal(await page.locator('[name="price"]').inputValue(),'','old KRW amount cleared');
   assert.match(await page.locator('#rqClPriceLabel').innerText(),/¥ JPY/);
   assert.equal(await page.locator('#rqClCurrency').evaluate(e=>new FormData(e.form).get('currency')),'JPY');
   assert.equal(await page.locator('[name="currency"]').count(),1);
   await page.locator('#rqClSellMethod').selectOption('fixed');
   assert.equal(await page.locator('[name="price"]').getAttribute('required'),'');
   await page.locator('#rqClSellMethod').selectOption('quotes');
   assert.equal(await page.locator('[name="price"]').getAttribute('required'),null,'price optional for quote');
   assert.match(await page.locator('#rqClPriceHelp').innerText(),/환산하지 않습니다|convert numbers|換算/);
   // Preserve the user's incomplete initial listing, with no accidental writes.
   assert.equal(data.brand,'YASKAWA');
   assert.equal(data.model,'CSRA-SDB06HA');
   assert.equal(data.itemCategory,'part');
   assert.equal(data.condition,'','unknown condition must be entered by seller');
   assert.equal(data.country,'','unknown sales region must be entered by seller');
   assert.equal(data.location,'');
   assert.equal(data.phone,'010-3975-7017');
   assert.equal(data.price,'');
   assert.match(fs.readFileSync(path.join(root,'v24.js'),'utf8'),/価格応相談|가격 협의/,'unspecified negotiated amount must be presented clearly to buyers');
   assert.match(data.description,/SERVOPACK CSRA-SDB06HA/);
   assert.equal(data.pictures,0,'photos are attached only by authenticated seller');
   assert.equal(data.checked,false,'seller declaration is never pre-checked');
   assert.equal(data.preset,'yaskawa-csra-sdb06ha');
   assert.equal(dbWrites.length,0,'querystring must not publish or create any listing');
   // Existing owner-only deletion remains available after the member publishes.
   assert(fs.readFileSync(path.join(root,'seller-backend.js'),'utf8').includes('window.rqDeleteSellerListing=async listingId=>'));
   assert.equal(errors.length,0,'unexpected page error '+JSON.stringify(errors));
   console.log('PASS guided YASKAWA listing at '+width+'px: prefill, required unknowns, no automatic DB writes');
   await ctx.close();
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
