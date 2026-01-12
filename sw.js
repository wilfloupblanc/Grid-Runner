const CACHE_NAME = 'grid-runner-v1.1.2';
const urlsToCache = [
    './',
    './index.html',
    './assets/styles/index.css',
    './script.js',
    './grid.js',
    './images/gridrunner.png',
    './images/mur.jpeg'
];

// Installation
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installation');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Mise en cache des fichiers');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // 👈 Force l'activation immédiate
    );
});

// Activation
self.addEventListener('activate', event => {
    console.log('✅ Service Worker: Activation');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
            .then(() => self.clients.claim())
    );
});

// Récupération (stratégie: Network First)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {

                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {

                return caches.match(event.request);
            })
    );
});