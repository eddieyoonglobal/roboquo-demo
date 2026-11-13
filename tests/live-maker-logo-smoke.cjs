#!/usr/bin/env node
/* Read-only production smoke test for RoboQuo maker identity assets. */
'use strict';
const assert=require('node:assert/strict');
const {setTimeout:delay}=require('node:timers/promises');
const BASE=(process.env.ROBOQUO_SITE||'https://roboquo.com').replace(/\/$/,'');
const EXPECTED=29;
async function get(path,timeout=14000){
 const url=new URL(path,BASE+'/');
 const resp=await fetch(url,{signal:AbortSignal.timeout(timeout),redirect:'follow',headers:{'Cache-Control':'no-cache','User-Agent':'RoboQuo-logo-deploy-check/1.0'}});
 const body=await resp.text();
 return {resp,body,url:url.href};
}
async function check(){
 const home=await get('/');
 assert.equal(home.resp.status,200,'Public home must respond HTTP 200');
 assert.match(home.body,/maker-logo-catalog\.js/,'Public home must load maker logo catalog');
 assert.match(home.body,/maker-logo-local-map\.js/,'Public home must load local logo registry');
 const mapFile=await get('/maker-logo-local-map.js');
 assert.equal(mapFile.resp.status,200,'Local map must be served');
 const match=mapFile.body.match(/window\.RQ_MAKER_LOGO_LOCAL\s*=\s*(\{[^;]*\})\s*;/s);
 assert(match,'Local logo map must contain a JSON object');
 const logos=JSON.parse(match[1]);
 const keys=Object.keys(logos);
 assert.equal(keys.length,EXPECTED,'All 29 manufacturer images must be mirrored');
 let failures=[];
 let idx=0;
 async function worker(){
  while(idx<keys.length){
   const name=keys[idx++];
   const src=logos[name];
   try{
    const out=await get(src);
    if(out.resp.status!==200||!/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(out.body.slice(0,1000))){
     failures.push({brand:name,http:out.resp.status,bytes:out.body.length,src});
    }
   }catch(e){failures.push({brand:name,error:String(e).slice(0,140),src});}
  }
 }
 await Promise.all(Array.from({length:6},worker));
 assert.equal(failures.length,0,'Manufacturer logo image failures: '+JSON.stringify(failures));
 return {site:BASE,siteUrl:home.resp.url,logos:keys.length,http200:keys.length,ok:true};
}
(async()=>{
 const attempts=10;
 for(let n=1;n<=attempts;n++){
  try{const result=await check();console.log('LIVE DEPLOYMENT VERIFIED '+JSON.stringify(result));return;}
  catch(e){
   console.error('LIVE ATTEMPT '+n+'/'+attempts+': '+e.message);
   if(n===attempts)process.exitCode=1;
   else await delay(9000);
  }
 }
})().catch(e=>{console.error(e.stack);process.exitCode=1});