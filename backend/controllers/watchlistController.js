// controllers/watchlistController.js
import Watchlist from "../models/Watchlist.js";

export const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user.id }).select(
      "movieData -_id"
    );
    // Only return entries that have a poster_path
    const watchlist = items
      .map((item) => item.movieData)
      .filter((movie) => movie && movie.poster_path);

    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch watchlist." });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { movieData } = req.body;

    if (!movieData || !movieData.id || !movieData.poster_path) {
      return res
        .status(400)
        .json({ message: "Invalid or incomplete movie data." });
    }

    const exists = await Watchlist.findOne({
      userId: req.user.id,
      movieId: movieData.id,
    });

    if (exists)
      return res.status(409).json({ message: "Movie already in watchlist." });

    const newEntry = await Watchlist.create({
      userId: req.user.id,
      movieId: movieData.id,
      movieData,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Failed to add movie to watchlist." });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const movieId = String(req.params.movieId); // ensure it's a string

    const deleted = await Watchlist.findOneAndDelete({
      userId: req.user.id,
      movieId: movieId.toString(), // ensure match regardless of type
    });

    if (!deleted) {
      return res.status(404).json({ message: "Movie not found in watchlist." });
    }

    res.json({ message: "Movie removed from watchlist." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove movie from watchlist." });
  }
};
