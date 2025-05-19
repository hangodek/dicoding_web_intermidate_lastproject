const CACHE_NAME = 'offline-v1';
const OFFLINE_URL = '/index.html'; // Your main HTML file
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/src/pages/homepage.js',
  '/assets/index.js',
  '/assets/index.css',
  '/registerSW.js',
  '/favicon.png',
  '/manifest.webmanifest'
];

// Helper function for caching
const cacheResources = async () => {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(PRECACHE_URLS);
};

// 1. Precache critical resources during install
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    cacheResources()
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// 2. Serve cached resources when offline
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL)) // Fallback to cached HTML
    );
  } 
  // Handle other assets (JS, CSS, etc.)
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const SERVER_URL = "https://story-api.dicoding.dev/v1/notifications/subscribe";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
};

self.addEventListener("install", async () => {
  // This will be called only once when the service worker is installed for first time.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function(event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
  } else {
    console.log("Push event but no data");
  }
});