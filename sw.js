// ناوی کاش بۆ ئەم وەشانەی ئەپە. ئەگەر فایلەکان گۆڕدران، دەبێت ئەم ناوە بگۆڕدرێت بۆ نوێکردنەوەی کاش.
const CACHE_NAME = 'gpu-ai-cache-v1';
// لیستێک لەو فایلانەی کە پێویستە کاش بکرێن بۆ کارکردنی ئۆفلاین.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/services/geminiService.ts',
  '/components/HomePage.tsx',
  '/components/ChatPage.tsx',
  '/components/icons/Icons.tsx',
];

// گوێگرتن لە eventی 'install' کە کاتێک service worker بۆ یەکەمجار دادەمەزرێت یان نوێ دەبێتەوە کاردەکەوێت.
self.addEventListener('install', (event) => {
  // چاوەڕێ دەکات تاوەکو هەموو فایلە پێویستەکان کاش دەکرێن.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // زیادکردنی هەموو URLەکان بۆ کاش.
        return cache.addAll(urlsToCache);
      })
  );
});

// گوێگرتن لە eventی 'fetch' کە بۆ هەر داواکارییەکی تۆڕ (network request) کاردەکەوێت.
self.addEventListener('fetch', (event) => {
  // وەڵامی داواکارییەکە دەداتەوە.
  event.respondWith(
    // سەرەتا لە کاشدا بۆ داواکارییەکە دەگەڕێت.
    caches.match(event.request)
      .then((response) => {
        // ئەگەر لە کاشدا دۆزرایەوە، وەڵامی کاشکراو دەگەڕێنێتەوە.
        if (response) {
          return response;
        }
        // ئەگەر لە کاشدا نەبوو، داواکارییەکە دەنێرێت بۆ تۆڕ.
        return fetch(event.request);
      })
  );
});

// گوێگرتن لە eventی 'activate' کە کاتێک service worker نوێ چالاک دەبێت کاردەکەوێت.
self.addEventListener('activate', (event) => {
  // لیستێکی سپی لەو کاشانەی کە دەبێت بمێننەوە (تەنها کاشی ئێستا).
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // هەموو ناوەکانی کاش وەردەگرێت.
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // بەسەر هەموو ناوەکاندا دەگەڕێت.
        cacheNames.map((cacheName) => {
          // ئەگەر کاشێک کۆن بوو (لە لیستی سپیدا نەبوو)، دەیسڕێتەوە.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
