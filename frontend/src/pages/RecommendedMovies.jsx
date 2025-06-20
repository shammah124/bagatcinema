import { useEffect, useState } from "react";
import { useRecommendations } from "../hooks/useRecommendations";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import LoadingSpinner from "../components/LoadingSpinner";
import NoResultsFound from "../components/NoResultsFound";
import { watchlistApi } from "../api/watchlistApi";
import { showToast } from "../utils/showToast";

export default function Recommendations() {
  const { movies, loading, error, selectedMovie, setSelectedMovie } =
    useRecommendations();
  const [savedMovies, setSavedMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Show first 10

  // Load watchlist on mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await watchlistApi.getWatchlist();
        const filtered = res
          .map((item) => item.movieData || item)
          .filter((movie) => movie && movie.poster_path && movie.id);
        setSavedMovies(filtered);
      } catch (err) {
        console.error("Failed to load watchlist:", err);
      }
    };
    fetchWatchlist();
  }, []);

  // Reset visibleCount when new recommendations load
  useEffect(() => {
    if (movies?.length) {
      setVisibleCount(10);
    }
  }, [movies]);

  // Toggle watchlist
  const onToggleWatchlist = async (movie, isSaved) => {
    try {
      if (isSaved) {
        await watchlistApi.removeFromWatchlist(movie.id);
        showToast("Removed from Watchlist", "warn");
        setSavedMovies((prev) => prev.filter((m) => m.id !== movie.id));
      } else {
        await watchlistApi.addToWatchlist(movie);
        showToast("Added to Watchlist", "success");
        setSavedMovies((prev) => [...prev, movie]);
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        showToast("Already in Watchlist", "info");
      } else {
        showToast("Watchlist update failed", "error");
        console.error(err);
      }
    }
  };

  const canShowMore = visibleCount < movies.length;

  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-12 pt-[80px]">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
        Personalized Recommendations
      </h2>

      {loading && <LoadingSpinner text="Fetching recommendations..." />}

      {!loading && error && (
        <p className="text-red-500 text-center">Error: {error}</p>
      )}

      {!loading && !error && movies.length === 0 && (
        <NoResultsFound message="No recommendations found. Try rating some movies to get personalized picks." />
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid
            movies={movies.slice(0, visibleCount)}
            onSelect={setSelectedMovie}
            showWatchlistButton
            savedMovies={savedMovies}
            onToggleWatchlist={onToggleWatchlist}
          />

          {canShowMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition">
                Show More
              </button>
            </div>
          )}
        </>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
