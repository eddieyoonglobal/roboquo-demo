'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),js=fs.readFileSync(path.join(dir,'maker-approved.js'),'utf8'),css=fs.readFileSync(path.join(dir,'maker-approved.css'),'utf8'),sw=fs.readFileSync(path.join(dir,'service-worker.js'),'utf8'),v24=fs.readFileSync(path.join(dir,'v24.js'),'utf8');
assert.ok(html.includes('maker-approved.css')&&html.includes('maker-approved.js'));
const existing=[...html.matchAll(/data-rq-featured-maker="([^"]+)"/g)];assert.equal(existing.length,29);
for(const b of ['DOBOT','JAKA','ESTUN','Techman Robot','HIWIN','Delta Electronics','Hanwha Robotics','Neuromeka'])assert.ok(js.includes("name:'"+b+"'"),'missing '+b);
const files=['dobot-approved.png','jaka-approved.png','estun-approved.png','techman-approved.png','hiwin-approved.png','delta-approved.png','hanwha-approved.png','neuromeka-approved.png','piab-approved.png','aidin-robotics-approved.png','pisco-approved.png'];
for(const file of files){assert.ok(sw.includes(file));assert.ok(fs.existsSync(path.join(dir,'assets/maker-logos',file)),'logo source missing '+file)}
assert.ok(css.includes('data-rq-featured-maker="FANUC"'));
assert.ok(v24.includes('판매자 사진 없음'));
assert.ok(js.includes("categoryFilter")&&js.includes("marketSearch"));
console.log('PASS manufacturer logos 37 and marketplace regression prerequisites');
