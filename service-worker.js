const CACHE='roboquo-v24-3-model-auth-language';
const ASSETS=['./','./index.html','./styles.css','./v24.css','./app.js','./v24.js','./supabase-config.js','./robot-model-master.js','./auth.js','./events-seed.json','./company-directory-seed.json','./purchase-channel-seed.json','./robot-directory-seed.json','./manifest.json','./icon-192.svg','./icon-512.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
