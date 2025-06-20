import { useEffect, useState } from "react";
import useMovieFilter from "../hooks/useMovieFilter";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import NoResultsFound from "../components/NoResultsFound";
import LoadingSpinner from "../components/LoadingSpinner";
import { watchlistApi } from "../api/watchlistApi";
import { showToast } from "../utils/showToast";

export default function TrendingMovies({ query }) {
  const [savedMovies, setSavedMovies] = useState([]);

  const {
    movies,
    genres,
    selectedGenre,
    setSelectedGenre,
    selectedSort,
    setSelectedSort,
    selectedLanguage,
    setSelectedLanguage,
    selectedYear,
    setSelectedYear,
    fetchMore,
    hasMore,
    loading,
    selectedMovie,
    setSelectedMovie,
    setQuery,
    setSearchMode,
  } = useMovieFilter({ defaultSort: "popularity.desc" });

  useEffect(() => {
    setQuery(query || "");
    setSearchMode(!!query?.trim());
  }, [query, setQuery, setSearchMode]);

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

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "hi", label: "Hindi" },
    { code: "yo", label: "Yoruba" },
    { code: "ig", label: "Igbo" },
    { code: "ha", label: "Hausa" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 mx-4 sm:mx-8 py-12 pt-[80px]">
      <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6 mt-4">
        {query ? "Search Results" : "Trending Movies"}
      </h2>

      {!query && (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
            aria-label="Select Genre">
            <option value="">All Genres</option>
            {(genres || []).map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
            aria-label="Sort By">
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
            aria-label="Select Language">
            <option value="">All Languages</option>
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-yellow-400"
            aria-label="Select Year">
            <option value="">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : movies.length > 0 ? (
        <>
          <MovieGrid
            movies={movies}
            onSelect={setSelectedMovie}
            showWatchlistButton={true}
            savedMovies={savedMovies}
            onToggleWatchlist={onToggleWatchlist}
            query={query}
          />

          <div className="flex justify-center mt-10">
            {hasMore ? (
              <button
                onClick={fetchMore}
                disabled={loading}
                className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Loading..." : "View More"}
              </button>
            ) : (
              <p className="text-gray-400 italic">No more movies to show.</p>
            )}
          </div>
        </>
      ) : (
        <NoResultsFound />
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
