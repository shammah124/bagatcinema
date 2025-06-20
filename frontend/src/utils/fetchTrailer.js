// src/utils/fetchTrailer.js
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export async function fetchTrailer(movieId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();

    const trailer = data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.error("Failed to fetch trailer:", error);
    return null;
  }
}
