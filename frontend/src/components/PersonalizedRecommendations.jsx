import { useEffect, useState } from "react";
import useRecommendations from "../hooks/useRecommendations";
import MovieGrid from "./MovieGrid";
import MovieModal from "./MovieModal";
import LoadingSpinner from "./LoadingSpinner";
import NoResultsFound from "./NoResultsFound";
import { watchlistApi } from "../api/watchlistApi";
import { showToast } from "../utils/showToast";

export default function PersonalizedRecommendations() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [savedMovies, setSavedMovies] = useState([]);
  const { recommended, loading } = useRecommendations(userPrefs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bagatcinemaUserInfo");
      setUserPrefs(stored ? JSON.parse(stored) : {});
    } catch (err) {
      console.error("Invalid userInfo in localStorage");
      setUserPrefs({});
    }
  }, []);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const data = await watchlistApi.getWatchlist();
        const filtered = data
          .map((item) => item.movieData || item)
          .filter((movie) => movie && movie.poster_path && movie.id);
        setSavedMovies(filtered);
      } catch (err) {
        console.error("Failed to load watchlist:", err);
      }
    };

    loadWatchlist();
  }, []);

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

  if (loading) {
    return <LoadingSpinner message="Loading your recommendations..." />;
  }

  if (!userPrefs) {
    return <p className="text-center text-white">Loading preferences...</p>;
  }

  return (
    <section className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-16 pt-[80px]">
      <h2 className="text- md:mt-10 sm:text-4xl font-bold text-center text-yellow-400 mb-10">
        Personalized Recommendations
      </h2>

      {recommended.length > 0 ? (
        <MovieGrid
          movies={recommended}
          onSelect={setSelectedMovie}
          showWatchlistButton
          savedMovies={savedMovies}
          onToggleWatchlist={onToggleWatchlist}
        />
      ) : (
        <NoResultsFound message="No personalized recommendations yet. Watch and rate movies to get started!" />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </section>
  );
}
