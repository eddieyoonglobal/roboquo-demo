/* RoboQuo transaction accuracy, signup return URL and local cleanup checks.
   Run: node tests/transaction-integrity-regression.cjs
   Uses mocks only: no accounts, DB writes, emails or payments. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const load=name=>fs.readFileSync(path.join(root,name),'utf8');
const app=load('app.js'),market=load('v24.js'),auth=load('auth.js'),backend=load('seller-backend.js');
for(const [file,source] of [['app.js',app],['v24.js',market],['auth.js',auth],['seller-backend.js',backend]])
  assert.doesNotThrow(()=>new Function(source),file+' syntax must remain valid');
// Seller-reported operating state must reach the details panel without inventing condition.
assert.match(backend,/operating_hours_text,operating_status,price/);
assert.match(backend,/operatingStatus:row\.operating_status\|\|'unknown'/);
for(const status of ['in_use','stored'])
  assert(market.includes("r.operatingStatus==='"+status+"'"),'explicit condition: '+status);
assert.match(market,/tx\('conditionUnverified'\)/);
assert.doesNotMatch(market,/Math\.round\(subtotal\*0\.02\)/,'unapproved 2% fee must not be charged');
assert.match(market,/tx\('indicativeTotal'\)/);
assert.doesNotMatch(market,/<div class="v24-payment-methods">/,'unsupported payment rails must not be shown as live');
const copyMatch=market.match(/const SAFE_TRANSACTION_COPY=(\{[^\n]+\});/);
assert(copyMatch,'localized transaction disclaimer exists');
const localized=JSON.parse(copyMatch[1]);
for(const lang of ['en','ja','ko','zh','de','fr','es','it','pt','vi']){
  for(const key of ['checkoutBody','paymentNotEnabled','conditionUnverified','operatingInUse','operatingStored','indicativeTotal']){
    assert(localized[lang]?.[key]?.trim(),'missing '+lang+'.'+key);
  }
}
// Test the actual authRedirectUrl function using the origin that launched signup.
const authStart=auth.indexOf('function authRedirectUrl(){');
const authEnd=auth.indexOf('\n  window.rqAuthSession=',authStart);
assert(authStart>=0&&authEnd>authStart);
const authFn=auth.slice(authStart,authEnd);
const redirect=(origin,pending)=>{
  const u=new URL(origin);
  return vm.runInNewContext(authFn+'\nauthRedirectUrl()',{
    location:{protocol:u.protocol,hostname:u.hostname,origin:u.origin},
    PROD_ORIGIN:'https://roboquo.com',pending,loadPending:()=>null,URL
  });
};
assert.equal(redirect('https://roboquo.com',{type:'sell'}),'https://roboquo.com/?resume=sell');
assert.equal(redirect('https://roboquo-feature.vercel.app',{type:'publishSell'}),'https://roboquo-feature.vercel.app/?resume=sell');
assert.equal(redirect('http://localhost:4173',null),'http://localhost:4173/');
// A confirmed server submission must not be reported as failed because IndexedDB cleanup fails.
const clearStart=app.indexOf('window.rqClearSellerDraft=async()=>{');
const clearEnd=app.indexOf('\n};',clearStart);
assert(clearStart>=0&&clearEnd>clearStart);
const cleanup=app.slice(clearStart,clearEnd+3);
(async()=>{
  const removed=[],ctx={
    window:{rqGetSellerPhotoRecords:async()=>[{slot:'overall'}]},
    rqSellDraft:{step:8},rqSellStep:8,RQ_SELL_DRAFT_VERSION:25,
    localStorage:{removeItem:k=>removed.push(k)},
    rqDeletePhoto:async()=>{throw Error('IndexedDB denied')},
    rqDraftPhotoKey:k=>k,
    console:{warn(){}}
  };
  vm.runInNewContext(cleanup,ctx);
  await assert.doesNotReject(ctx.window.rqClearSellerDraft());
  assert.equal(ctx.rqSellStep,1);
  assert.equal(ctx.rqSellDraft.step,undefined);
  assert(removed.includes('rqSellDraftV22'));
  console.log('PASS transaction copy, reported condition, no invented fees, auth redirect, safe draft cleanup');
})().catch(err=>{console.error(err);process.exitCode=1});
