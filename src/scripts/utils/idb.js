const DB_NAME = 'StoryAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveStoriesToIDB = async (stories) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  stories.forEach(story => store.put(story));
  return new Promise(resolve => tx.oncomplete = resolve);
};

export const getStoriesFromIDB = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise(resolve => {
    store.getAll().onsuccess = e => resolve(e.target.result);
  });
};