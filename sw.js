self.importScripts('data/data.js');

// Files to cache
var dataCacheName = 'wes-o-Data-v1';
var cacheName = 'wes-o-Final-v1';
var appShellFiles = [
  '/pwa/wes-o_pwa/',
  '/pwa/wes-o_pwa/index.html',
  '/pwa/wes-o_pwa/app/app.js',
  '/pwa/wes-o_pwa/style.css',
  '/pwa/wes-o_pwa/data/fonts/graduate.eot',
  '/pwa/wes-o_pwa/data/fonts/graduate.ttf',
  '/pwa/wes-o_pwa/data/fonts/graduate.woff',
  '/pwa/wes-o_pwa/favicon.ico',
  '/pwa/wes-o_pwa/img/bg_header.png',
  '/pwa/wes-o_pwa/data/icons/icon-32.png',
  '/pwa/wes-o_pwa/data/icons/icon-64.png',
  '/pwa/wes-o_pwa/data/icons/icon-96.png',
  '/pwa/wes-o_pwa/data/icons/icon-128.png',
  '/pwa/wes-o_pwa/data/icons/icon-168.png',
  '/pwa/wes-o_pwa/data/icons/icon-192.png',
  '/pwa/wes-o_pwa/data/icons/icon-256.png',
  '/pwa/wes-o_pwa/data/icons/icon-512.png'
];
var contentImages = [];
for(var i=0; i<entries.length; i++) {
  contentImages.push('data/img_entries/'+entries[i].slug+'.jpg');
}
var contentToCache = appShellFiles.concat(contentImages);

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell + content');
      return cache.addAll(contentToCache);
    })
  );
});

// Activate Service Worker once loaded
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  //Fixes a corner case in which the app was not returning the latest data.
  return self.clients.claim();
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});