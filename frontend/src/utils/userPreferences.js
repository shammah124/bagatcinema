// src/utils/userPreferences.js
import API from "../api/api";

// BACKEND STORAGE: Ratings
export async function saveUserRating(movieId, rating) {
  await API.post("/feedback", { movieId, rating });
}

export async function getUserRating(movieId) {
  const res = await API.get(`/feedback/${movieId}`);
  return res.data?.rating || null;
}

// BACKEND STORAGE: Reviews
export async function saveUserReview(movieId, review) {
  await API.post("/feedback", { movieId, review });
}

export async function getUserReview(movieId) {
  const res = await API.get(`/feedback/${movieId}`);
  return res.data?.review || null;
}

// BACKEND: Get all feedback
export async function getAllUserFeedback() {
  const res = await API.get("/feedback");
  return res.data;
}

// LOCAL STORAGE: Watch History
const WATCH_HISTORY_KEY = "bagatcinema_watch_history";

// Save watched movie to localStorage
export function saveToWatchHistory(movie) {
  const history = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY)) || [];

  if (!history.some((m) => m.id === movie.id)) {
    history.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      watched_at: new Date().toISOString(),
    });

    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  }
}

// Retrieve watch history from localStorage
export function getWatchHistory() {
  return JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY)) || [];
}
