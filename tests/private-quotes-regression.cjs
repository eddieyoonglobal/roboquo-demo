/* Private quote frontend controls: fixture only; never writes to a real Supabase project. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','quote-market.js'),'utf8');
let modal='',messages=[],queries=0,allowWrite=false;
const listing={id:'seller:dummy',backendId:'e7d51b6a-44c4-4e75-95ee-fb2b32c5a122',sale:'bid',brand:'OnRobot',model:'RG6',currency:'JPY',_source:'seller-supabase'};
const win={
 rqAuthSession:{user:{id:'buyer-example'}},
 rqCanWriteSupabase:()=>allowWrite,
 rqSupabase:{from:()=>{queries++;throw Error('Never call real DB in preview test');}},
 toast:x=>messages.push(x),
 openModal:html=>{modal=html},
 rqRequireAuth:()=>{throw Error('Already signed in')}
};
const doc={documentElement:{lang:'ja'},readyState:'loading',addEventListener(){}};
const fake={window:win,document:doc,console,Intl,Date,Number,String,Object,Array,JSON,Error};
fake.allRobotListings=()=>[listing];
vm.runInNewContext(source,fake);
assert.equal(typeof win.rqOpenBuyerOffer,'function');
win.rqOpenBuyerOffer('seller:dummy');
assert.equal(modal,'','preview must not open an actionable proposal form');
assert.equal(queries,0,'preview must never access production API');
assert(messages.some(msg=>msg.includes('プレビュー')),'preview status must explain no writes');
allowWrite=true;
win.rqOpenBuyerOffer('seller:dummy');
assert.match(modal,/rqOfferForm/,'authenticated buyer opens private quotation form');
assert.match(modal,/name="amount"/,'quote amount is required');
assert.match(modal,/name="agree"/,'buyer explicitly accepts the no-negotiation rule');
assert.match(modal,/現地/,'Japanese site uses local inspection terms');
assert.equal(queries,0,'opening proposal form must not cause a DB write');
modal='';win.rqOpenBuyerOffer('seller:unknown');
assert.equal(modal,'','unverified/nonexistent items cannot be quoted');
assert.equal(queries,0,'fake listings cannot generate database traffic');
assert.match(source,/marketplace_purchase_offers/,'real buyer/seller offers must use the RLS-protected table');
assert.match(source,/visit_scheduled/,'inspection scheduling is represented');
assert.match(source,/inspection_passed/,'buyer may confirm inspection');
assert.match(source,/completed/,'seller may record offline sale completion');
assert.doesNotMatch(source,/service[_-]role|secret_key/,'no service role material in public quote module');
console.log('PASS private-quote preview isolation, real listing guard, Japanese no-renegotiation UI, private RLS table');
