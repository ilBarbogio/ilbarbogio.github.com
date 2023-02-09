const PRECACHE="precache-v1",RUNTIME="runtime",PRECACHE_URLS=["index.html","components.bundle.js","index.bundle.js","index.css","styles/components/device-buttons.css","styles/components/loading-widget.css","styles/components/simple-button.css","styles/components/simple-caption.css","styles/components/simple-slider.css","styles/components/snap-button.css","assets/backtodevice.svg","assets/camera.svg","assets/envcamera.svg","assets/no.svg","assets/ok.svg","assets/resnap.svg","assets/selfiecamera.svg","assets/share.svg","assets/logo16.png","assets/logo64.png","assets/logo192.png","assets/logo512.png"];self.addEventListener("install",(s=>{s.waitUntil(caches.open(PRECACHE).then((s=>s.addAll(PRECACHE_URLS))).then(self.skipWaiting()))})),self.addEventListener("activate",(s=>{const e=[PRECACHE,RUNTIME];s.waitUntil(caches.keys().then((s=>s.filter((s=>!e.includes(s))))).then((s=>Promise.all(s.map((s=>caches.delete(s)))))).then((()=>self.clients.claim())))})),self.addEventListener("fetch",(s=>{s.request.url.startsWith(self.location.origin)&&s.respondWith(caches.match(s.request).then((e=>e||caches.open(RUNTIME).then((e=>fetch(s.request).then((t=>e.put(s.request,t.clone()).then((()=>t)))))))))}));
