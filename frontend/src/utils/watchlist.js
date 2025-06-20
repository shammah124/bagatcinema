// src/utils/watchlist.js
import API from "../api/api";

// Fetch the user's watchlist from the backend
export const getWatchlist = async () => {
  const { data } = await API.get("/watchlist");
  return data.map((item) => item.movieData);
};

// Check if a movie is already in the watchlist
export const isMovieInWatchlist = async (movieId) => {
  const watchlist = await getWatchlist();
  return watchlist.some((movie) => movie.id === movieId);
};

// Add a movie to the watchlist
export const addToWatchlist = async (movie) => {
  await API.post("/watchlist", {
    movieId: movie.id,
    movieData: movie,
  });
};

// Remove a movie from the watchlist
export const removeFromWatchlist = async (movieId) => {
  await API.delete(`/watchlist/${movieId}`);
};

// Toggle watchlist status for a movie
export const toggleWatchlist = async (movie) => {
  const exists = await isMovieInWatchlist(movie.id);
  if (exists) {
    await removeFromWatchlist(movie.id);
  } else {
    await addToWatchlist(movie);
  }
};
