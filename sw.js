const CACHE_NAME = 'screen-recorder-chromebook-v14';
const APP_FILES = [
  '',
  'index.html',
  'deck.html',
  'runner.html',
  'editor.html',
  'pdf-editor.html',
  'screenrecorder.html',
  'flattener.html',
  'inspector.html',
  'player.html',
  'weblab.html',
  'vault.html',
  'image-studio.html',
  'theme.js',
  'tool-theme.css',
  'manifest.json',
  'icon-512.png',
  'pwa.js',
  'sw.js',
  'vendor/marked.min.js',
  'vendor/jspdf.umd.min.js',
  'vendor/pdfjs/pdf.min.js',
  'vendor/pdfjs/pdf.worker.min.js',
  'vendor/pdf-lib/pdf-lib.min.js',
  'vendor/tesseract/tesseract.min.js',
  'vendor/tesseract/worker.min.js',
  'vendor/tesseract/tesseract-core-simd-lstm.wasm.js',
  'vendor/tesseract/tesseract-core-simd-lstm.wasm',
  'vendor/tesseract/lang/eng.traineddata.gz',
  'pyodide/pyodide.js',
  'pyodide/pyodide.asm.js',
  'pyodide/pyodide.asm.wasm',
  'pyodide/pyodide-lock.json',
  'pyodide/python_stdlib.zip'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const files = APP_FILES.map((file) => new URL(file, self.registration.scope));
    await cache.addAll(files);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const oldCaches = await caches.keys();
    await Promise.all(oldCaches
      .filter((name) => name === 'pwa-cache-v1' || (
        name.startsWith('screen-recorder-chromebook-') && name !== CACHE_NAME
      ))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin ||
      !requestUrl.href.startsWith(self.registration.scope)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    if (request.mode === 'navigate') {
      const offlinePage = await cache.match(new URL('index.html', self.registration.scope));
      if (offlinePage) return offlinePage;
    }

    return fetch(request);
  })());
});
