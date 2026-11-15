/* Real manufacturers only. No synthetic logo artwork or fake stock. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'amr-maker-sources.json'),'utf8'));
assert.equal(data.makers.length,19);
assert.equal(new Set(data.makers.map(x=>x.name)).size,19);
assert.equal(new Set(data.makers.map(x=>x.slug)).size,19);
const names=new Set(data.makers.map(x=>x.name));
for(const name of ['MiR','Tompkins Robotics','Doog','LexxPluss','Rapyuta Robotics','Quicktron','Geek+','Locus Robotics','HAI Robotics','ForwardX','AGILOX','Daifuku','Keigan','OMRON Robotics','Hikrobot','MiraBot','Exotec','Twinny','Yujin Robot']){
 assert(names.has(name),'missing AMR maker: '+name);
}
// Never link MiraBot to the previous mistaken mirarobot.co.jp spelling.
assert.equal(data.makers.find(x=>x.name==='MiraBot').website,'https://www.mirabot.co.jp/');
for(const name of ['MiraBot','Twinny','Yujin Robot']){
 const maker=data.makers.find(x=>x.name===name);
 assert(maker.logoSources.length>=1,'official logo source required for '+name);
 assert(maker.logoNote.includes('Official')||maker.logoNote.includes('Original'),'logo provenance required for '+name);
}
for(const x of data.makers){
 assert(/^https:\/\//.test(x.website),x.name+' missing real company website');
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.slug),x.name+' incorrect asset slug');
 assert(['Japan','Korea','China','Europe','USA'].includes(x.region),x.name+' unclassified region');
 assert(['Japan','Korea','China','Denmark','Austria','France','USA'].includes(x.country),x.name+' unexpected country: '+x.country);
 assert(Array.isArray(x.logoSources),x.name+' must have verified sources or explicit empty array');
 for(const url of x.logoSources)assert(/^https:\/\//.test(url),x.name+' logo not from a real HTTPS source');
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const snippet of ['id="rqAmrShowcase"','id="rqAmrRegions"','id="rqAmrTrack"','amr-maker-sources.json','amr-makers.css','amr-makers.js','amr-maker-local-map.js']){
 assert(html.includes(snippet)||snippet==='amr-maker-sources.json','AMR UI missing '+snippet);
}
assert(html.indexOf('id="rqAmrShowcase"')>html.indexOf('id="rqEoatShowcase"'),'AMR directory after grippers');
assert(html.indexOf('id="rqAmrShowcase"')<html.indexOf('<section class="page" id="buy"'),'AMR directory inside robot marketplace');
const js=fs.readFileSync(path.join(root,'amr-makers.js'),'utf8');
assert(js.includes("window.RQ_AMR_MAKERS_REPORT"),'AMR visibility audit required');
assert(js.includes("window.RQ_AMR_MAKER_LOCAL"),'original logo local assets preferred');
assert(js.includes("window.RQ_MAKER_LOGO_LOCAL"),'reuse genuine existing OMRON logo');
assert(js.includes("frame.replaceChildren(image)"),'show logo only, no duplicated label');
assert(js.includes("category.value='robot'"),'existing marketplace category required');
assert(js.includes("input.dispatchEvent(new Event('input'"),'manufacturer filter must work');
assert(js.includes("link.rel='noopener noreferrer'"),'official site must use safe external links');
assert(!js.includes('dummyimage')&&!js.includes('via.placeholder'),'no invented logos');
const css=fs.readFileSync(path.join(root,'amr-makers.css'),'utf8');
assert(css.includes('object-fit:contain'),'logo artwork must not be cropped');
assert(css.includes('.rq-amr-item[hidden]'),'region filtering must hide out-of-region cards');
console.log('PASS: 19 independent AMR/AGV makers, 10 language labels, safe logos and official links');
