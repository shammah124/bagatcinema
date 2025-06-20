import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MovieModal from "../components/MovieModal";
import { watchlistApi } from "../api/watchlistApi";
import { showToast } from "../utils/showToast";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setIsLoading(true);
        const data = await watchlistApi.getWatchlist();

        // Handle nested movieData (from backend format)
        const filtered = data
          .map((item) => item.movieData || item) // Support both structures
          .filter((movie) => movie && movie.poster_path && movie.title);

        setMovies(filtered);
      } catch (err) {
        console.error("Failed to load watchlist:", err);
        showToast("Failed to load your watchlist", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await watchlistApi.removeFromWatchlist(String(movieId));
      setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
      showToast("Removed from watchlist", "warn");
    } catch (err) {
      console.error("Failed to remove movie:", err);
      console.log(typeof movieId);
      showToast("Failed to remove movie", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-20 pt-[100px]">
      <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
        Your Watchlist
      </h2>

      <div className="text-center mb-8">
        <p className="text-sm sm:text-base lg:text-lg text-gray-400">
          You currently have{" "}
          <span className="text-yellow-300 font-semibold">{movies.length}</span>{" "}
          movie{movies.length === 1 ? "" : "s"} in your watchlist.
        </p>
        {movies.length > 0 && movies.length < 3 && (
          <p className="text-xs sm:text-sm text-sky-400 mt-1 italic">
            Don’t stop now — keep exploring and add more favorites!
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="h-[300px] bg-gray-800 animate-pulse rounded-xl"
              />
            ))}
        </div>
      ) : movies.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || "Movie Poster"}
                  className="w-full h-[320px] object-cover cursor-pointer"
                  onClick={() => setSelectedMovie(movie)}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {movie.release_date?.slice(0, 4)} •{" "}
                    {movie.vote_average
                      ? `${movie.vote_average.toFixed(1)}/10`
                      : "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(movie.movieId || movie.id)}
                  className="absolute top-2 right-2 w-6 h-6 sm:w-6 sm:h-6 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full flex items-center justify-center shadow transition focus:outline-none focus:ring-1 focus:ring-red-300"
                  title="Remove from Watchlist"
                  aria-label="Remove from Watchlist">
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg mb-4">No movies saved yet.</p>
          <p className="text-sm mb-6">
            Start exploring and add your favorites!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-semibold transition hover:scale-105">
            Go to Homepage
          </button>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
