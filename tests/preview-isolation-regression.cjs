/* Preview isolation tests — never touches Supabase or creates accounts.
   Run: node tests/preview-isolation-regression.cjs */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const config=fs.readFileSync(path.join(root,'supabase-config.js'),'utf8');
const seller=fs.readFileSync(path.join(root,'seller-backend.js'),'utf8');
const auth=fs.readFileSync(path.join(root,'auth.js'),'utf8');
function configFor(hostname,language='ko'){
  const window={location:{hostname}};
  vm.runInNewContext(config,{window,document:{documentElement:{lang:language}},URL});
  return window;
}
const prod=configFor('roboquo.com');
const preview=configFor('roboquo-fix.vercel.app');
assert.equal(prod.rqCanWriteSupabase(),true,'production origin keeps seller ability');
assert.equal(preview.rqCanWriteSupabase(),false,'preview cannot write live database');
assert.match(preview.rqPreviewReadOnlyMessage(),/운영 DB/);
const localhost=configFor('localhost');
assert.equal(localhost.rqCanWriteSupabase(),false,'local server cannot create production accounts');
preview.RQ_SUPABASE_URL='https://separate-staging-db.supabase.co';
assert.equal(preview.rqCanWriteSupabase(),true,'isolated staging endpoint may accept test writes');
assert.match(auth,/mode==='signup'&&window\.rqCanWriteSupabase\?\.\(\)===false/,'preview signup guard');
assert.match(seller,/PREVIEW_READ_ONLY/,'preview listing guard');
const actionLog=[];
const w={
  rqCanWriteSupabase:()=>false,
  rqSupabase:{from(){actionLog.push('database accessed');throw Error('unexpected production access')}},
  rqAuthSession:{user:{id:'test-owner'}},
  rqGetSellerPhotoRecords:async()=>[{blob:{},slot:'overall'}]
};
const document={documentElement:{lang:'ko'},readyState:'loading',addEventListener(){}};
vm.runInNewContext(seller,{window:w,document,setTimeout,console});
(async()=>{
 await assert.rejects(w.rqSubmitSellerListing({companyName:'Test'}),e=>e.code==='PREVIEW_READ_ONLY');
 assert.deepEqual(actionLog,[],'no production database request made');
 console.log('PASS Preview read-only guard for production Supabase, isolated test database allowed');
})().catch(e=>{console.error(e);process.exitCode=1});
