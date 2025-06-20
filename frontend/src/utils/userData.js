// src/utils/userData.js

// Save only movie IDs for watched history
export function saveToWatchHistory(movieId) {
  try {
    const key = "watchedHistory";
    const raw = localStorage.getItem(key);
    let history = raw ? JSON.parse(raw) : [];

    if (!history.includes(movieId)) {
      history.push(movieId);

      // Limit to last 100 movies to avoid quota
      if (history.length > 100) {
        history = history.slice(history.length - 100);
      }

      localStorage.setItem(key, JSON.stringify(history));
    }
  } catch (e) {
    console.warn("Watch history error:", e);
  }
}

export function getWatchHistory() {
  try {
    const raw = localStorage.getItem("watchedHistory");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save only { id, rating } instead of full movie objects
export function saveUserRating(movieId, rating) {
  const key = "userRatings";
  const raw = localStorage.getItem(key);
  const ratings = raw ? JSON.parse(raw) : {};

  ratings[movieId] = rating;
  localStorage.setItem(key, JSON.stringify(ratings));
}

export function getUserRating(movieId) {
  const raw = localStorage.getItem("userRatings");
  const ratings = raw ? JSON.parse(raw) : {};
  return ratings[movieId] || null;
}

// Save short string reviews (limit length client-side if needed)
export function saveUserReview(movieId, reviewText) {
  const key = "userReviews";
  const raw = localStorage.getItem(key);
  const reviews = raw ? JSON.parse(raw) : {};

  reviews[movieId] = reviewText;
  localStorage.setItem(key, JSON.stringify(reviews));
}

export function getUserReview(movieId) {
  const raw = localStorage.getItem("userReviews");
  const reviews = raw ? JSON.parse(raw) : {};
  return reviews[movieId] || null;
}
