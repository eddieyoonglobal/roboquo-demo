const CACHE='roboquo-static';
const ASSETS=['./','./index.html','./styles.css','./v24.css','./app.js','./v24.js','./supabase-config.js','./robot-model-master.js','./auth.js','./seller-backend.js','./events-seed.json','./company-directory-seed.json','./purchase-channel-seed.json','./robot-directory-seed.json','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png','./icon-192.svg','./icon-512.svg','./social-preview.png'];
const ASSET_PATHS=new Set(ASSETS.map(path=>new URL(path,self.location.href).pathname));

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('roboquo-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));

self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url);if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(()=>caches.match('./index.html')));
    return;
  }
  if(!ASSET_PATHS.has(url.pathname))return;
  event.respondWith(caches.match(request).then(cached=>{
    const update=fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response;});
    return cached||update;
  }));
});
