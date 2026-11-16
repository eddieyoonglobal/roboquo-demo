/* Seller signs in after preparing first YASKAWA product; full draft must survive. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html;charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png'};
const server=http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return;}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'}).end(b);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const chrome=['/usr/bin/chromium','/usr/bin/google-chrome','/usr/bin/chromium-browser'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,executablePath:chrome||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 for(const width of [390,1440]){
  const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  const page=await ctx.newPage(),writes=[],errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('**/*',route=>{
   const url=route.request().url();
   if(url.startsWith(base+'/'))return route.continue();
   if(url.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js')){
    return route.fulfill({status:200,contentType:'application/javascript',body:
     "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),signInWithPassword:async({email})=>({data:{session:{user:{id:'7e840bfd-a730-432d-9ff3-a236236a7a1d',email,user_metadata:{display_name:'Seller'}}}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>({select(){return this},eq(){return this},order:async()=>({data:[],error:null})})})};"});
   }
   if(url.includes('.supabase.co/')){if(!['GET','HEAD'].includes(route.request().method()))writes.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:'[]'});}
   return route.abort();
  });
  await page.goto(base+'/?firstProduct=yaskawa-csra-sdb06ha',{waitUntil:'domcontentloaded'});
  await page.locator('#rqQuickSellForm').waitFor({timeout:15000});
  await page.evaluate(()=>window.rqCanWriteSupabase=()=>true); // Local fixture only; never an actual production write.
  await page.waitForFunction(()=>document.querySelector('#rqClMakerSelect option[value="YASKAWA"]'));
  await page.locator('#rqClCountry').selectOption('Korea');
  await page.locator('#rqQuickSellForm select[name="itemCondition"]').selectOption('used');
  await page.locator('#rqQuickSellForm input[name="location"]').fill('Seoul, Korea');
  await page.locator('#rqQuickSellForm input[name="companyName"]').fill('QA Seller');
  await page.locator('#rqQuickSellForm input[name="contactEmail"]').fill('seller@example.test');
  await page.locator('#rqQuickSellForm input[name="contactPhone"]').fill('010-3975-7017');
  await page.locator('#rqQuickSellForm input[name="price"]').fill('3000000');
  await page.locator('#rqClPhotos').setInputFiles({name:'yaskawa-test.jpg',mimeType:'image/jpeg',buffer:Buffer.from([255,216,255,217])});
  await page.locator('#rqQuickSellForm input[name="declared"]').check();
  const original=await page.locator('#rqQuickSellForm textarea[name="description"]').inputValue();
  await page.locator('#rqClSubmit').click();
  await page.locator('#rqAuthPassword').waitFor({timeout:10000});
  assert.equal(await page.locator('#rqQuickSellForm').count(),0,'authentication replaces the sell form but stores the draft');
  await page.locator('#rqAuthEmail').fill('seller@example.test');
  await page.locator('#rqAuthPassword').fill('test-only-login-password');
  await page.locator('#modal form button[type="submit"]').click();
  await page.locator('#rqQuickSellForm').waitFor({timeout:10000});
  const restored=await page.evaluate(()=>{
   const form=document.getElementById('rqQuickSellForm');
   const el=name=>form.elements.namedItem(name);
   return {
    price:el('price').value,model:el('model').value,location:el('location').value,country:el('country').value,
    currency:el('currency').value,email:el('contactEmail').value,phone:el('contactPhone').value,
    description:el('description').value,photos:form.querySelector('#rqClPhotos').files.length,
    consent:el('declared').checked
   };
  });
  assert.equal(restored.price,'3000000');
  assert.equal(restored.model,'CSRA-SDB06HA');
  assert.equal(restored.country,'Korea');
  assert.equal(restored.currency,'KRW');
  assert.equal(restored.location,'Seoul, Korea');
  assert.equal(restored.email,'seller@example.test');
  assert.equal(restored.phone,'010-3975-7017');
  assert.equal(restored.description,original);
  assert.equal(restored.photos,1,'in-memory file selection restored');
  assert.equal(restored.consent,false,'prior consent cannot silently reapply');
  assert.equal(writes.length,0,'neither login nor draft resume can publish or write to DB');
  assert.equal(errors.length,0,'browser exceptions '+JSON.stringify(errors));
  console.log('PASS seller auth return '+width+'px: listing, currency and photos preserved; consent reset; zero DB writes');
  await ctx.close();
 }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(err=>{console.error(err);process.exitCode=1});
