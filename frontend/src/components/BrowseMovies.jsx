import { useRef, useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import useMovieFilter from "../hooks/useMovieFilter";
import GenreFilter from "../components/GenreFilter";
import LanguageFilter from "../components/LanguageFilter";
import YearFilter from "../components/YearFilter";
import SearchBar from "../components/SearchBar";
import NoResultsFound from "../components/NoResultsFound";
import LoadingSpinner from "../components/LoadingSpinner";
import { watchlistApi } from "../api/watchlistApi";

export default function BrowseMovies() {
  const {
    movies,
    fetchMore,
    hasMore,
    selectedMovie,
    setSelectedMovie,
    filters,
    setFilters,
    query,
    setQuery,
    setSearchMode,
    loading,
  } = useMovieFilter();

  const observer = useRef();
  const [savedMovies, setSavedMovies] = useState([]);

  const lastMovieRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, fetchMore]
  );

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setSearchMode(true);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchMode(false);
    }
  }, [query]);

  // Load watchlist once on mount
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await watchlistApi.getWatchlist();
        const flattened = data.map((item) => item.movieData || item);
        setSavedMovies(flattened);
      } catch (err) {
        console.error("Failed to load saved movies:", err);
      }
    };
    fetchSaved();
  }, []);

  // Watchlist toggler
  const handleToggleWatchlist = (movie, wasSaved) => {
    setSavedMovies((prev) =>
      wasSaved ? prev.filter((m) => m.id !== movie.id) : [...prev, movie]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-8 py-12 pt-[80px]">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 text-center mb-8">
        Browse Movies
      </h2>

      <div className="max-w-4xl mx-auto mb-6">
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      </div>

      {!query && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 px-2">
          <GenreFilter filters={filters} setFilters={setFilters} />
          <LanguageFilter filters={filters} setFilters={setFilters} />
          <YearFilter filters={filters} setFilters={setFilters} />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : movies.length === 0 ? (
          <NoResultsFound />
        ) : (
          <MovieGrid
            movies={movies}
            onSelect={setSelectedMovie}
            lastRef={lastMovieRef}
            showWatchlistButton={true}
            savedMovies={savedMovies} // Pass watchlist state
            onToggleWatchlist={handleToggleWatchlist} // Pass toggler
            query={query}
          />
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
