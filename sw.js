// İnternet yokken de açılsın diye dosyaları önbellekte tutar. Güncellemede SURUM'u artır.
const SURUM = 'turbip-1';
const DOSYALAR = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Önce ağdan dene (güncel sürüm gelsin), olmazsa önbellekten ver
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(r => {
      const kopya = r.clone();
      caches.open(SURUM).then(c => c.put(e.request, kopya));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
