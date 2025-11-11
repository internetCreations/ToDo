/**
 * IndexedDB Manager Module
 * This module provides functions to initialize the database and perform
 * bulk read/write operations for a single data table (object store).
 *
 * NOTE: It assumes your data records have a unique 'id' field for the keyPath.
 */

const DB_NAME = 'PWATodoDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'tasksData'; // The "table" name

let db = null; // Private variable to hold the database connection

/**
 * Helper function to get a transaction and the object store.
 * @param {string} mode - 'readonly' or 'readwrite'
 * @returns {Promise<IDBObjectStore>} The object store.
 */
function getObjectStore(mode) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized. Call initDB() first.'));
            return;
        }
        try {
            const transaction = db.transaction([STORE_NAME], mode);
            transaction.onerror = (e) => reject(e.target.error);
            resolve(transaction.objectStore(STORE_NAME));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Initializes and opens the IndexedDB connection.
 * MUST be called before any other operation.
 * @returns {Promise<void>} Resolves when the database is open.
 */
export async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Create the object store, specifying 'id' as the key path.
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                console.log(`IndexedDB: Store '${STORE_NAME}' created.`);
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB: Database opened successfully.');
            resolve();
        };

        request.onerror = (event) => {
            console.error('IndexedDB: Initialization error.', event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Clears the existing data in the store and saves a new array of records.
 * This is effective for replacing a whole "table" of data.
 * @param {Array<Object>} data - The array of objects to save.
 * @returns {Promise<void>} Resolves when all data is saved.
 */
export async function saveAllRecords(data) {
    try {
        const store = await getObjectStore('readwrite');
        
        // 1. Clear existing data
        const clearRequest = store.clear();

        await new Promise((resolve, reject) => {
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = (e) => reject(e.target.error);
        });

        console.log(`IndexedDB: Store '${STORE_NAME}' cleared.`);

        // 2. Add new records
        const promises = data.map(record => {
            return new Promise((resolve, reject) => {
                const addRequest = store.add(record);
                addRequest.onsuccess = () => resolve();
                addRequest.onerror = (e) => reject(e.target.error);
            });
        });

        await Promise.all(promises);
        console.log(`IndexedDB: Successfully saved ${data.length} records.`);

    } catch (error) {
        console.error('IndexedDB: Error saving records.', error);
        throw error; // Propagate the error up to the application layer
    }
}

/**
 * Retrieves all records from the object store (the "table").
 * @returns {Promise<Array<Object>>} Resolves with an array of all records.
 */
export async function getAllRecords() {
    try {
        const store = await getObjectStore('readonly');
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    } catch (error) {
        console.error('IndexedDB: Error retrieving records.', error);
        return []; // Return an empty array or throw, depending on app preference
    }
}