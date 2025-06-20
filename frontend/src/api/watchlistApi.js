import API from "./api";

// API wrapper for watchlist routes
export const watchlistApi = {
  // Fetch the current user's watchlist
  getWatchlist: async () => {
    try {
      const res = await API.get("/watchlist");
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      return [];
    }
  },

  // Add a movie to the watchlist
  addToWatchlist: async (movie) => {
    try {
      const res = await API.post("/watchlist", {
        movieData: movie, // Expecting movieData field
      });
      return res.data;
    } catch (err) {
      console.error(
        "Failed to add to watchlist:",
        err?.response?.data || err.message
      );
      throw err; // let caller handle 409 or others
    }
  },

  // Remove a movie using its `movieId` (not TMDB `id`)
  removeFromWatchlist: async (movieId) => {
    try {
      await API.delete(`/watchlist/${movieId}`);
    } catch (err) {
      console.error(
        "Failed to remove from watchlist:",
        err?.response?.data || err.message
      );
      throw err;
    }
  },
};
