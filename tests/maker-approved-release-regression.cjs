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
const regionStart=js.indexOf('const originals={');
const regionEnd=js.indexOf('const translations=',regionStart);
assert.ok(regionStart>=0&&regionEnd>regionStart,'maker region map missing');
const assignedMakers=[...js.slice(regionStart,regionEnd).matchAll(/'([^']+)'/g)].map(match=>match[1]);
const currentMakers=existing.map(match=>match[1]);
assert.equal(assignedMakers.length,29,'All existing maker cards must have a region');
assert.equal(new Set(assignedMakers).size,29,'A maker must belong to exactly one region');
assert.deepEqual([...assignedMakers].sort(),[...currentMakers].sort(),'Maker region map must match visible cards');
assert.ok(js.includes("setupRegionPicker(track,'rqMakerRegionPicker',['','Japan','Korea','China','Taiwan','Europe'])"),'Robot region picker missing Europe');
assert.ok(js.includes("setupRegionPicker(eoatTrack,'rqEoatRegionPicker',['','Japan','Korea','Europe'])"),'Gripper region picker missing');
assert.ok(js.includes("document.querySelectorAll('#robots [data-rq-featured-maker]')"),'Both maker galleries must be classified');
for(const language of ['en','ko','ja','zh','de','fr','es','it','pt','vi']){
 assert.ok(js.includes(language+":{all:")&&js.includes('europe:'),'Region translations must cover every supported language: '+language);
}
console.log('PASS manufacturer logos 37 and marketplace regression prerequisites');
