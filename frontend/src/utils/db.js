import { openDB } from "idb";

// Open or create BagatCinema IndexedDB
const dbPromise = openDB("BagatCinemaDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("watched")) {
      db.createObjectStore("watched", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("ratings")) {
      db.createObjectStore("ratings", { keyPath: "movieId" });
    }
    if (!db.objectStoreNames.contains("reviews")) {
      db.createObjectStore("reviews", { keyPath: "movieId" });
    }
  },
});

// 🎞 Watch History
export async function saveWatchedMovie(movie) {
  try {
    const db = await dbPromise;
    await db.put("watched", {
      ...movie,
      watched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save watched movie:", err);
  }
}

export async function getWatchedMovies() {
  try {
    const db = await dbPromise;
    return await db.getAll("watched");
  } catch (err) {
    console.error("Failed to fetch watched movies:", err);
    return [];
  }
}

// Ratings
export async function saveUserRating(movieId, rating) {
  try {
    const db = await dbPromise;
    await db.put("ratings", { movieId, rating });
  } catch (err) {
    console.error("Failed to save rating:", err);
  }
}

export async function getUserRating(movieId = null) {
  try {
    const db = await dbPromise;
    if (movieId) {
      return await db.get("ratings", movieId);
    }
    const all = await db.getAll("ratings");
    const result = {};
    all.forEach((item) => {
      result[item.movieId] = item;
    });
    return result;
  } catch (err) {
    console.error("Failed to fetch rating(s):", err);
    return {};
  }
}

// Reviews
export async function saveUserReview(movieId, review) {
  try {
    const db = await dbPromise;
    await db.put("reviews", { movieId, review });
  } catch (err) {
    console.error("Failed to save review:", err);
  }
}

export async function getUserReview(movieId = null) {
  try {
    const db = await dbPromise;
    if (movieId) {
      return await db.get("reviews", movieId);
    }
    const all = await db.getAll("reviews");
    const result = {};
    all.forEach((item) => {
      result[item.movieId] = item;
    });
    return result;
  } catch (err) {
    console.error("Failed to fetch review(s):", err);
    return {};
  }
}
