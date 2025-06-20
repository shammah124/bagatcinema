import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import Watchlist from "../models/Watchlist.js";
import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";

const languageMap = {
  English: "en",
  French: "fr",
  Spanish: "es",
  Hindi: "hi",
  Yoruba: "yo",
  Igbo: "ig",
  Hausa: "ha",
};

export const getRecommendations = async (req, res) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const userId = req.user?.id || req.user?.userId;

  if (!TMDB_API_KEY) {
    return res.status(500).json({ message: "TMDB API key is not configured" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const preferences = user.preferences || {};
    const language = languageMap[preferences.preferredLanguage] || "en";
    const moodGenreMap = {
      Relaxed: "Comedy",
      Excited: "Action",
      Curious: "Mystery",
      Romantic: "Romance",
      Scared: "Horror",
      Inspired: "Drama",
    };
    const moodGenre = moodGenreMap[preferences.mood];

    const sortMap = {
      "Every day": "popularity.desc",
      "Several times a week": "vote_average.desc",
      "Once a week": "release_date.desc",
      Occasionally: "revenue.desc",
    };
    const sortBy = sortMap[preferences.watchFrequency] || "popularity.desc";

    // Fetch feedback & watchlist in parallel
    const [feedback, watchlist] = await Promise.all([
      Feedback.find({ userId }),
      Watchlist.find({ userId }),
    ]);

    const ratedOrSavedMovieIds = [
      ...new Set([
        ...feedback.map((f) => f.movieId),
        ...watchlist.map((w) => w.movieData?.id),
      ]),
    ].filter(Boolean);

    // Try to fetch actor ID
    let actorId = null;
    if (preferences.favoriteActor) {
      try {
        const actorSearch = await axios.get(`${TMDB_BASE}/search/person`, {
          params: { api_key: TMDB_API_KEY, query: preferences.favoriteActor },
        });
        actorId = actorSearch.data?.results?.[0]?.id || null;
      } catch (err) {
        console.warn("Failed to fetch actor ID:", err.message);
      }
    }

    // Get genres from movie details
    const genreCount = {};
    for (const movieId of ratedOrSavedMovieIds) {
      try {
        const { data } = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
          params: { api_key: TMDB_API_KEY },
        });
        for (const genre of data.genres || []) {
          genreCount[genre.id] = (genreCount[genre.id] || 0) + 1;
        }
      } catch (err) {
        console.warn(`Failed to get details for movieId ${movieId}`);
      }
    }

    // Convert genre count to sorted ID list
    let genreIds = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => parseInt(id));

    // Fallback to preferences
    if (!genreIds.length) {
      try {
        const genreRes = await axios.get(`${TMDB_BASE}/genre/movie/list`, {
          params: { api_key: TMDB_API_KEY },
        });

        const nameToId = {};
        for (const g of genreRes.data.genres || []) {
          nameToId[g.name] = g.id;
        }

        genreIds = [
          ...new Set([
            ...(preferences.genres || [])
              .map((g) => nameToId[g])
              .filter(Boolean),
            ...(moodGenre ? [nameToId[moodGenre]] : []),
          ]),
        ];
      } catch (err) {
        return res.status(500).json({ message: "Could not resolve genres" });
      }
    }

    if (!genreIds.length) {
      return res.json([]);
    }

    // Discover movies
    let results = [];

    try {
      const discoverRes = await axios.get(`${TMDB_BASE}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreIds.slice(0, 3).join(","),
          with_original_language: language,
          with_cast: actorId || undefined,
          sort_by: sortBy,
          vote_count_gte: 50,
        },
      });
      results = discoverRes.data?.results || [];
    } catch (err) {
      console.warn("TMDB discover call failed:", err.message);
    }

    // Retry without actor if no results
    if (!results.length && actorId) {
      const fallbackRes = await axios.get(`${TMDB_BASE}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreIds.slice(0, 3).join(","),
          with_original_language: language,
          sort_by: sortBy,
          vote_count_gte: 50,
        },
      });
      results = fallbackRes.data?.results || [];
    }

    // Filter out already rated
    const ratedIds = feedback.map((f) => f.movieId?.toString());
    const recommendations = results.filter(
      (m) => !ratedIds.includes(m.id?.toString())
    );

    return res.json(recommendations.slice(0, 20));
  } catch (err) {
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
};
