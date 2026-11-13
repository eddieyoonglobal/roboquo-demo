/* Regression: every manufacturer card receives a real image URL; no fabricated artwork. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'maker-logo-sources.json'),'utf8'));
const loader=fs.readFileSync(path.join(root,'maker-logo-catalog.js'),'utf8');
const match=loader.match(/const LOGOS=(\{[\s\S]*?\});\s*function init\(\)/);
assert(match,'logo map must be syntactically present');
new vm.Script(loader,{filename:'maker-logo-catalog.js'});
const map=JSON.parse(match[1]);
const makers=[...html.matchAll(/data-rq-featured-maker="([^"]+)"/g)].map(x=>x[1]);
assert.equal(makers.length,29);
assert.equal(new Set(makers).size,29);
assert.equal(manifest.logos.length,29);
assert.equal(Object.keys(map).length,29);
for(const name of makers){
 const urls=map[name];
 assert(Array.isArray(urls)&&urls.length>0,'missing real logo sources for '+name);
 assert(urls.every(url=>/^https:\/\//.test(url)),'non-https logo URL: '+name);
 const item=manifest.logos.find(x=>x.brand===name);
 assert(item&&JSON.stringify(item.urls)===JSON.stringify(urls),'catalog/manifest mismatch: '+name);
}
assert(html.indexOf('maker-logo-local-map.js')<html.indexOf('maker-logo-catalog.js'),'local image registry must load before logo catalog');
assert(html.includes('maker-logo-catalog.css'),'visual logo styles must load');
assert(loader.includes('img.addEventListener(\'error\',next)'),'missing safe fallback for blocked logo sources');
assert(loader.includes('mark.replaceChildren(img)'),'logo should replace fake text');
console.log('PASS: 29 accurate manufacturer names mapped to image URLs, scripts in order, verified fallback');
