/* Published seller listing resilience; mocks only, no live Supabase calls. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','seller-backend.js'),'utf8');
function harness(query,sign){
 const events={},screens=[],timers=[],warns=[];
 const document={hidden:false,readyState:'loading',documentElement:{lang:'en'},addEventListener:(name,fn)=>{events[name]=fn}};
 const api={from:()=>({select(){return this},eq(){return this},order(){return query()}}),
   storage:{from:()=>({createSignedUrl:path=>sign(path)})}};
 const window={rqSupabase:api,rqAuthSession:null,rqSetSellerLiveListings:rows=>screens.push(rows)};
 const setTimeout=(fn,delay)=>{const timer={fn,delay};timers.push(timer);return timer};
 const clearTimeout=()=>{};
 vm.runInNewContext(source,{window,document,setTimeout,clearTimeout,Date,console:{warn:(...x)=>warns.push(x)}});
 return {events,screens,timers,warns,document};
}
const fixture=id=>({
 id,manufacturer:'FANUC',model:'CRX TEST',country:'Japan',
 seller_company_name:'Fixture Co',price:100000,currency:'JPY',
 listing_type:'fixed',operating_status:'stored',
 seller_listing_photos:[{slot:'overall',storage_path:'broken.png',sort_order:0},{slot:'nameplate',storage_path:'signed.png',sort_order:1}]
});
(async()=>{
 let signatures=0;
 const t=harness(async()=>({data:[fixture('fixture-a')],error:null}),
   async path=>{
     signatures++;
     if(path==='broken.png')throw Object.assign(new Error('network error'),{code:'NETWORK'});
     return {data:{signedUrl:'https://example.test/secure/'+path},error:null};
   });
 await t.events['rq:authready']();
 assert.equal(t.screens.length,1);
 assert.equal(t.screens[0].length,1,'broken photo must not hide published listing');
 assert.equal(t.screens[0][0].photoUrl,'https://example.test/secure/signed.png');
 assert.equal(t.screens[0][0].operatingStatus,'stored');
 assert(t.warns.length>0,'signed photo failure is reported without exposing private path');
 assert.equal(t.timers.at(-1).delay,45*60*1000,'signed links refreshed before one-hour expiry');
 await t.timers.at(-1).fn();
 assert.equal(signatures,4,'refresh should request fresh signed URLs');
 let pending=[];
 const racing=harness(()=>new Promise(resolve=>pending.push(resolve)),
   async()=>({data:{signedUrl:'https://example.test/a'},error:null}));
 const earlier=racing.events['rq:authready']();
 const newer=racing.events['rq:authready']();
 pending[1]({data:[fixture('new')],error:null});
 await newer;
 pending[0]({data:[fixture('old')],error:null});
 await earlier;
 assert.equal(racing.screens.length,1,'old slower request cannot overwrite newer listing state');
 assert.equal(racing.screens[0][0].backendId,'new');
 console.log('PASS published listings: partial photo failures, signed URL refresh and stale-query safety');
})().catch(e=>{console.error(e);process.exitCode=1});
