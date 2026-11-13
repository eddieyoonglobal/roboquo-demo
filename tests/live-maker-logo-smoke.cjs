#!/usr/bin/env node
/* Read-only production smoke test for RoboQuo maker identity assets. */
'use strict';
const assert=require('node:assert/strict');
const {setTimeout:delay}=require('node:timers/promises');
const BASE=(process.env.ROBOQUO_SITE||'https://roboquo.com').replace(/\/$/,'');
const EXPECTED=29;
const NEW_LOGOS=['dobot-approved.png','jaka-approved.png','estun-approved.png','techman-approved.png','hiwin-approved.png','delta-approved.png','hanwha-approved.png','neuromeka-approved.png','piab-approved.png','aidin-robotics-approved.png','pisco-approved.png'];
async function get(path,timeout=14000){
 const url=new URL(path,BASE+'/');
 const resp=await fetch(url,{signal:AbortSignal.timeout(timeout),redirect:'follow',headers:{'Cache-Control':'no-cache','User-Agent':'RoboQuo-logo-deploy-check/1.0'}});
 const bytes=Buffer.from(await resp.arrayBuffer());
 const body=bytes.toString('utf8');
 return {resp,body,bytes,url:url.href};
}
async function check(){
 const home=await get('/');
 assert.equal(home.resp.status,200,'Public home must respond HTTP 200');
 assert.match(home.body,/maker-logo-catalog\.js/,'Public home must load maker logo catalog');
 assert.match(home.body,/maker-logo-local-map\.js/,'Public home must load local logo registry');
 assert.match(home.body,/maker-approved\.js/,'Public home must load 37-brand approved browser');
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
    const isSvg=/<svg(?:\s|>)/i.test(out.body.slice(0,4000));
    const isPng=out.bytes.length>=8&&out.bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
    if(out.resp.status!==200||!(isSvg||isPng)){
     failures.push({brand:name,http:out.resp.status,bytes:out.body.length,src});
    }
   }catch(e){failures.push({brand:name,error:String(e).slice(0,140),src});}
  }
 }
 await Promise.all(Array.from({length:6},worker));
 
 for(const name of NEW_LOGOS){
  const url=new URL('/assets/maker-logos/'+name,BASE+'/');
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(12000),redirect:'follow',headers:{'Cache-Control':'no-cache','User-Agent':'RoboQuo-logo-deploy-check/1.0'}});
   const bytes=Buffer.from(await response.arrayBuffer());
   const isPng=bytes.length>=8&&bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
   if(response.status!==200||!isPng)failures.push({approvedLogo:name,http:response.status,bytes:bytes.length});
  }catch(e){failures.push({approvedLogo:name,error:String(e).slice(0,140)});}
 }
 assert.equal(failures.length,0,'Manufacturer logo image failures: '+JSON.stringify(failures));
 return {site:BASE,siteUrl:home.resp.url,logos:37,existingLocal:keys.length,additionalOriginalFiles:NEW_LOGOS.length,http200:keys.length+NEW_LOGOS.length,ok:true};
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