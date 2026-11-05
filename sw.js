/* Edzésnapló service worker. The app page is always fetched fresh when online;
   the stored copy is used only offline. Data never passes through here. */
const VERSION='edz-v17';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(SHELL.map(u=>fetch(u,{cache:'reload'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k!==VERSION+'-fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    const isPage=req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
    if(isPage){
      // network first: always the newest app when online, stored copy when offline
      e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put('./',cp))}return r})
        .catch(()=>caches.open(VERSION).then(async c=>(await c.match(req,{ignoreSearch:true}))||(await c.match('./'))||(await c.match('index.html')))));
      return;
    }
    e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(req,{ignoreSearch:true});
      const net=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>null);return hit||(await net)||Response.error()}));
    return;
  }
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(VERSION+'-fonts').then(async c=>{const hit=await c.match(req);if(hit)return hit;
      try{const r=await fetch(req);c.put(req,r.clone());return r}catch(err){return Response.error()}}));
  }
});
