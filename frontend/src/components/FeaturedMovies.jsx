import { useEffect, useState } from "react";
import { fetchFromTMDB } from "../api/fetchTMDB";
import { watchlistApi } from "../api/watchlistApi";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import NoResultsFound from "../components/NoResultsFound";
import LoadingSpinner from "../components/LoadingSpinner";
import { showToast } from "../utils/showToast";

export default function FeaturedMovies() {
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFromTMDB("/genre/movie/list", "movie_genres").then((data) => {
      setGenres(data.genres || []);
    });

    const fetchWatchlist = async () => {
      try {
        const data = await watchlistApi.getWatchlist();
        const filtered = data
          .map((item) => item.movieData || item)
          .filter((m) => m && m.poster_path && m.id);
        setSavedMovies(filtered);
      } catch (err) {
        console.error("Failed to load watchlist:", err);
      }
    };

    fetchWatchlist();
  }, []);

  useEffect(() => {
    loadMovies(page);
  }, [page, selectedGenre]);

  const loadMovies = async (currentPage) => {
    setLoading(true);
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
    const cacheKey = `featured_movies_page_${currentPage}_genre_${
      selectedGenre || "all"
    }`;
    const data = await fetchFromTMDB(
      `/discover/movie?page=${currentPage}${genreParam}`,
      cacheKey
    );
    setMovies((prev) => [...prev, ...(data.results || [])]);
    setLoading(false);
  };

  const handleViewMore = () => {
    setPage((prev) => prev + 1);
  };

  const onToggleWatchlist = async (movie, isSaved) => {
    try {
      if (isSaved) {
        await watchlistApi.removeFromWatchlist(movie.id);
        setSavedMovies((prev) => prev.filter((m) => m.id !== movie.id));
        showToast("Removed from Watchlist", "warn");
      } else {
        await watchlistApi.addToWatchlist(movie);
        setSavedMovies((prev) => [...prev, movie]);
        showToast("Added to Watchlist", "success");
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
      showToast("Watchlist update failed", "error");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 min-h-screen pt-[90px] flex flex-col">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-white text-center">
        Featured Movies
      </h2>

      <div className="mb-6 text-center">
        <select
          value={selectedGenre}
          onChange={(e) => {
            setMovies([]);
            setPage(1);
            setSelectedGenre(e.target.value);
          }}
          className="bg-gray-800 text-white px-4 py-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {!loading && movies.length === 0 && <NoResultsFound />}

      {!loading && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={setSelectedMovie}
          showWatchlistButton={true}
          savedMovies={savedMovies}
          onToggleWatchlist={onToggleWatchlist}
          query={query}
        />
      )}

      {!loading && movies.length > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleViewMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Loading..." : "View More"}
          </button>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
