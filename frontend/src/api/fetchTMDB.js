// src/api/fetchTMDB.js
import { getCachedData, setCachedData } from "../utils/cache";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromTMDB = async (endpoint, cacheKey = "", ttl = 3600000) => {
  const cached = getCachedData(cacheKey, "session");
  if (cached) return cached;

  try {
    const url = `${BASE_URL}${endpoint}${
      endpoint.includes("?") ? "&" : "?"
    }api_key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("TMDB error response:", data);
      throw new Error("TMDB Error");
    }

    setCachedData(cacheKey, data, ttl, "session");
    return data;
  } catch (err) {
    console.error("TMDB fetch failed:", err);
    throw err;
  }
};
