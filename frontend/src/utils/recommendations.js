// src/utils/recommendations.js
import API from "../api/api";

export async function getRecommendedMovies() {
  const res = await API.get("/recommendations");
  return res.data;
}
