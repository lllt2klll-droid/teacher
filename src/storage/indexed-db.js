/* ==========================================================================
   TeacherStudio IndexedDB Layer - Local-First Persistent Store
   ========================================================================== */

const DB_NAME = 'TeacherStudio_DB';
const DB_VERSION = 1;
const STORES = ['projects', 'contents', 'templates', 'settings'];

let dbInstance = null;

export const IndexedDBStore = {
  async getDb() {
    if (dbInstance) return dbInstance;
    if (typeof indexedDB === 'undefined') {
      console.warn('IndexedDB is not supported in this environment.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.error('Failed to open IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  async getAll(storeName) {
    try {
      const db = await this.getDb();
      if (!db) return [];
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error(`IndexedDB getAll failed on ${storeName}:`, e);
      return [];
    }
  },

  async get(storeName, id) {
    try {
      const db = await this.getDb();
      if (!db) return null;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error(`IndexedDB get failed on ${storeName}/${id}:`, e);
      return null;
    }
  },

  async put(storeName, item) {
    try {
      const db = await this.getDb();
      if (!db) return false;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error(`IndexedDB put failed on ${storeName}:`, e);
      return false;
    }
  },

  async delete(storeName, id) {
    try {
      const db = await this.getDb();
      if (!db) return false;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error(`IndexedDB delete failed on ${storeName}/${id}:`, e);
      return false;
    }
  },

  async clear(storeName) {
    try {
      const db = await this.getDb();
      if (!db) return false;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return false;
    }
  }
};
