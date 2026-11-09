/* RoboQuo seller/marketplace regressions. No database or network writes. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const seller=fs.readFileSync(path.join(root,'seller-backend.js'),'utf8');
const market=fs.readFileSync(path.join(root,'v24.js'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
new Function(seller);new Function(market);new Function(app);
assert.match(market,/r\._source==='seller-supabase'&&!isDemo\(r\)/,'marketplace must show real seller-submitted items only');
assert.match(market,/\$\('#robots \.v24-market-note'\)\?\.remove\(\)/,'repeated market promotion is removed from the first screen');
assert.match(market,/rq-market-empty/,'the market still explains an empty inventory');
assert.match(market,/setLiveAndRefresh/,'live-data updates refresh marketplace status');
const publish=app.slice(app.indexOf('window.rqPublishSell='),app.indexOf('function sellFlow()',app.indexOf('window.rqPublishSell=')));
assert.match(publish,/SELLER_BACKEND_UNAVAILABLE/);
assert.doesNotMatch(publish,/await rqSaveLocalDemoListing\(/,'failed live submission must not create a demo listing');
function setup(photoRecords,changeStatus){
 const actions=[];
 const q=(table,method)=>{
   const item={eq(){return this},select(){return this},order(){return Promise.resolve({data:[],error:null})},
     single:async()=>method==='insert'?{data:{id:'listing-1'},error:null}:
       changeStatus==='missing'?{data:null,error:null}:{data:{id:'listing-1',status:'published'},error:null},
     then(resolve,reject){return Promise.resolve({error:null}).then(resolve,reject)}};
   return item;
 };
 const api={from:table=>({
   insert:payload=>{actions.push(['insert',table]);return q(table,'insert')},
   update:payload=>{actions.push(['update',table]);return q(table,'update')},
   delete:()=>{actions.push(['delete',table]);return q(table,'delete')}
 }),storage:{from:()=>({
   upload:async()=>{actions.push(['upload']);return {error:null}},
   remove:async()=>{actions.push(['remove']);return {error:null}}
 })}};
 const window={rqSupabase:api,rqAuthSession:{user:{id:'user-1'}},rqGetSellerPhotoRecords:async()=>photoRecords};
 const document={documentElement:{lang:'en'},readyState:'loading',addEventListener(){}};
 vm.runInNewContext(seller,{window,document,setTimeout:()=>0,clearTimeout:()=>{},Date,console});
 return {submit:window.rqSubmitSellerListing,actions};
}
(async()=>{
 const empty=setup([]);
 await assert.rejects(empty.submit({companyName:'Test Ltd',declared:true}),e=>e.code==='PHOTO_REQUIRED');
 assert.deepEqual(empty.actions,[],'no database writes before photo validation');
 for(const invalid of [
   {slot:'overall',blob:{},type:'image/gif',name:'unsupported.gif',size:100},
   {slot:'overall',blob:{},type:'image/jpeg',name:'oversized.jpg',size:15728641},
   {slot:'overall',blob:{},type:'image/jpeg',name:'empty.jpg',size:0}
 ]){
   const reject=setup([invalid]);
   await assert.rejects(reject.submit({companyName:'Test Ltd',declared:true}),e=>e.code==='PHOTO_INVALID');
   assert.deepEqual(reject.actions,[],'invalid photos must not generate seller/contact records');
 }
 const photo=[{slot:'overall',blob:{},name:'test.jpg',type:'image/jpeg',size:100}];
 const valid=setup(photo);
 const result=await valid.submit({companyName:'Test Ltd',declared:true,maker:'FANUC',model:'CRX'});
 assert.equal(result.status,'published');
 assert(valid.actions.some(([kind])=>kind==='upload'));
 assert(valid.actions.some(([kind])=>kind==='update'));
 const missing=setup(photo,'missing');
 await assert.rejects(missing.submit({companyName:'Test Ltd',declared:true}),e=>e.code==='SUBMISSION_UNCONFIRMED');
 assert(missing.actions.some(([kind])=>kind==='delete'),'unconfirmed submission is cleaned up');
 console.log('PASS RoboQuo real listings: photo validation, immediate publish confirmation and failure cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});
