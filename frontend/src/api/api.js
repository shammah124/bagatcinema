import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("bagatcinemaUserInfo"));
  const token = userInfo?.token;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

const TMDB_API_KEY = "966951f8abca33ce7a88763555eb6340";

(async () => {
  try {
    const res = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
  } catch (err) {
    console.error("TMDB Error:", err.response?.data || err.message);
  }
})();

export default API;
