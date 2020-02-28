
interface Store {
  get: (key: string) => Promise<any>
  keys: () => Promise<string[]>
  set: (key: string, value: any) => Promise<void>
  purge: () => Promise<void>
  remove: (key: string) => Promise<void>
  destroy: () => Promise<void>
}

interface IndexeDBWrapper {
  stores: { [store: string]: Store }
}

export default ({ stores = ['default'], version = 1, databaseName = 'indexeddb-wrapper' } = {}): IndexeDBWrapper => {
  const anyWindow = window as any

  const dbPromise: Promise<IDBDatabase> = new Promise((resolve, reject) => {
    const request = (window.indexedDB || anyWindow.mozIndexedDB || anyWindow.webkitIndexedDB)
      .open(databaseName, version);

    request.onsuccess = e => {
      resolve((e.target as any).result);
    };
    request.onerror = e => {
      reject(e);
    };
    request.onupgradeneeded = e => {
      const db = (e.target as any).result;
      stores.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      });
    };

    request.onblocked = e => {
      reject(e);
    }
  });

  const cacheStores: { [store: string]: Store } = {}

  stores.forEach(storeName => {
    const getStore = (mode: "readwrite" | "readonly" | "versionchange" = 'readwrite') => dbPromise.then(db => {
      const transaction = db.transaction([storeName], mode);
      transaction.onabort = e => {
        const error = (e.target as any).error
        throw error
      };
      return transaction.objectStore(storeName);
    })

    const get = (key: string): Promise<any> => getStore('readonly').then(store => new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = e => { resolve((e.target as any).result as any); };
      request.onerror = reject;
    }));

    const keys = (): Promise<string[]> => getStore('readonly').then(store => new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = e => resolve((e.target as any).result);
      request.onerror = reject;
    }))

    const set = (key: string, value: any): Promise<void> => getStore().then(store => new Promise((resolve, reject) => {
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = reject;
    }))

    const remove = (key: string): Promise<void> => getStore().then(store => new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = reject;
    }))

    const purge = (): Promise<void> => getStore().then(store => new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve();
      request.onerror = reject;
    }))

    const destroy = () => dbPromise.then(db => db.deleteObjectStore(storeName))

    cacheStores[storeName] = {
      get,
      set,
      remove,
      purge,
      destroy,
      keys
    }
  })

  return { stores: cacheStores }
}

