import { useState } from "react";
import highlightQuery from "../utils/highlightQuery";

export default function MovieCard({
  movie,
  onClick,
  query = "",
  showWatchlist = false,
  isSaved = false,
  onToggleWatchlist = () => {},
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await onToggleWatchlist(movie, isSaved); // delegate to parent
    } finally {
      setLoading(false);
    }
  };

  const getRatingClass = (rating) => {
    if (rating >= 8) return "bg-green-700 text-green-300";
    if (rating >= 6) return "bg-yellow-700 text-yellow-300";
    return "bg-red-700 text-red-300";
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-gray-800 rounded-xl shadow hover:shadow-xl hover:scale-[1.03] transition-transform overflow-hidden cursor-pointer group">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/fallback.jpg"
        }
        alt={movie.title || "Movie Poster"}
        className="w-full h-64 sm:h-72 md:h-80 object-cover"
        loading="lazy"
      />

      {movie.vote_average && (
        <div
          className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold shadow-md ${getRatingClass(
            movie.vote_average
          )}`}>
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      )}

      <div className="p-3">
        <h3 className="text-base sm:text-lg font-semibold truncate text-white">
          {highlightQuery(movie.title, query)}
        </h3>
        <p className="text-xs text-gray-400">
          {movie.release_date?.split("-")[0]}
        </p>
      </div>

      {showWatchlist && (
        <button
          onClick={handleToggle}
          disabled={loading}
          title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
          className={`absolute top-3 right-3 text-xl transition ${
            isSaved ? "text-red-500" : "text-white"
          } ${loading ? "opacity-50 animate-pulse" : ""}`}>
          {isSaved ? "❤️" : "🤍"}
        </button>
      )}
    </div>
  );
}
