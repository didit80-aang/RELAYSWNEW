/* Service worker Relay Control — naikkan VERSION setiap kali index.html diubah agar cache diperbarui */
const VERSION = "v1";
const CACHE = "relay-control-" + VERSION;
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];
const CDN = "https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js";

self.addEventListener("install", e=>{
  e.waitUntil((async()=>{
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    try{ await c.add(new Request(CDN, { mode:"no-cors" })); }catch(_){}   // library MQTT ikut tersimpan agar bisa dibuka offline
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k.startsWith("relay-control-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e=>{
  const req = e.request, url = new URL(req.url);
  if(req.method !== "GET") return;
  const sameOrigin = url.origin === location.origin;
  if(!sameOrigin && url.href !== CDN) return;           // MQTT (WebSocket) & lainnya tidak disentuh

  if(req.mode === "navigate"){                           // halaman: jaringan dulu, cadangan dari cache
    e.respondWith(fetch(req).then(r=>{ const cp = r.clone(); caches.open(CACHE).then(c=>c.put("./index.html", cp)); return r; })
      .catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit=>{            // aset: cache dulu, perbarui di latar belakang
    const net = fetch(req).then(r=>{ if(r && (r.ok || r.type === "opaque")){ const cp = r.clone(); caches.open(CACHE).then(c=>c.put(req, cp)); } return r; }).catch(()=>hit);
    return hit || net;
  }));
});
