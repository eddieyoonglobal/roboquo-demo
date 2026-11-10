/* Buyer inquiry fallback: opens a draft, never silently sends an inquiry.
   Run: node tests/buyer-inquiry-regression.cjs */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const s=fs.readFileSync(path.join(__dirname,'..','v24.js'),'utf8');
const start=s.indexOf('window.rqContactAboutListing=');
const end=s.indexOf('\n  window.rqOpenProduct',start);
assert(start>0&&end>start,'buyer inquiry action exists');
const handler=s.slice(start,end);
assert.doesNotMatch(handler,/\bfetch\(|\.from\(|sendEmail\(/,'buyer inquiry must not claim to send without a backend');
const copy=JSON.parse(s.match(/const SAFE_TRANSACTION_COPY=(\{[^\n]+\});/)[1]);
for(const l of ['en','ja','ko','zh','de','fr','es','it','pt','vi'])
  for(const k of ['contactRoboquo','contactExplanation','openEmail','listingReference'])
    assert(copy[l]?.[k],l+'.'+k);
let selected={id:'seller:abc',backendId:'abc',brand:'FANUC',model:'CRX-10iA',demo:false};
let result='';
const ctx={
  window:{},findListing:()=>selected,idOf:r=>r.id,isDemo:r=>r.demo===true,
  tx:k=>copy.en[k]||k,
  escHtml:v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;'),
  openModal:html=>{result=html},
  encodeURIComponent
};
vm.runInNewContext(handler,ctx);
ctx.window.rqContactAboutListing('seller:abc','offer');
assert.match(result,/mailto:sales@roboquo\.com\?/);
assert.match(result,/Reference%3A%20abc/);
assert.match(result,/Purpose%3A%20offer/);
assert.match(result,/%0A/,'draft must contain readable line breaks');
assert.match(result,/FANUC/);
selected={...selected,demo:true};
result='';ctx.window.rqContactAboutListing('seller:abc','purchase');
assert.equal(result,'','demo listings must not be actionable');
assert.equal((s.match(/const askAction=escHtml\(isPrivateQuote/g)||[]).length,2,'listing card and detail route private offers separately from email inquiry');
assert.match(s,/rqOpenBuyerOffer/,'private quote action is linked only to real offer-enabled listings');
console.log('PASS buyer inquiry: localized, correct listing reference, draft-only, demo blocked');
