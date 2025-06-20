// src/utils/cache.js

// Retrieve cached data from sessionStorage or localStorage
export const getCachedData = (key, storageType = "session") => {
  try {
    // Choose storage type: sessionStorage (default) or localStorage
    const storage = storageType === "local" ? localStorage : sessionStorage;

    const item = storage.getItem(key); // Retrieve cached item
    if (!item) return null; // No cache found

    const { data, expiry } = JSON.parse(item); // Parse cache structure

    // If the cache has expired, remove it and return null
    if (Date.now() > expiry) {
      storage.removeItem(key);
      return null;
    }

    return data; // Return valid cached data
  } catch (err) {
    // Catch and log any errors in parsing or accessing storage
    console.warn("Cache fetch error:", err);
    return null;
  }
};

// Save data to sessionStorage or localStorage with an expiry time
export const setCachedData = (
  key,
  data,
  ttl = 3600000, // Default time-to-live is 1 hour (in milliseconds)
  storageType = "session"
) => {
  try {
    // Choose storage type: sessionStorage (default) or localStorage
    const storage = storageType === "local" ? localStorage : sessionStorage;

    // Create cache entry with expiry timestamp
    const entry = {
      data,
      expiry: Date.now() + ttl,
    };

    // Store serialized entry in the selected storage
    storage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    // Catch and log any errors while saving to storage
    console.warn("Cache save error:", err);
  }
};
