import { useState, useEffect } from "react";
import { fetchFromTMDB } from "../api/fetchTMDB";
import useDebounce from "../hooks/useDebounce";

export default function useMovieFilter({
  defaultSort = "popularity.desc",
} = {}) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSort, setSelectedSort] = useState(defaultSort);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const debouncedQuery = useDebounce(query.trim());

  const filters = {
    selectedGenre,
    selectedLanguage,
    selectedYear,
    selectedSort,
  };

  const setFilters = ({
    genre = selectedGenre,
    language = selectedLanguage,
    year = selectedYear,
    sort = selectedSort,
  }) => {
    setSelectedGenre(genre);
    setSelectedLanguage(language);
    setSelectedYear(year);
    setSelectedSort(sort);
    setPage(1);
    setMovies([]);
  };

  // Fetch genres once
  useEffect(() => {
    fetchFromTMDB("/genre/movie/list", "movie_genres")
      .then((data) => setGenres(data.genres || []))
      .catch((e) => console.error("Genre fetch error", e));
  }, []);

  // Fetch movies when filters, search mode, debounced query, or page changes
  useEffect(() => {
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
    const langParam = selectedLanguage
      ? `&with_original_language=${selectedLanguage}`
      : "";
    const yearParam = selectedYear
      ? `&primary_release_year=${selectedYear}`
      : "";

    const fetchData = async () => {
      let endpoint = "";
      let cacheKey = "";

      if (searchMode && debouncedQuery) {
        endpoint = `/search/movie?query=${encodeURIComponent(
          debouncedQuery
        )}&page=${page}`;
        cacheKey = `search_${debouncedQuery}_page_${page}`;
      } else {
        endpoint = `/discover/movie?sort_by=${selectedSort}${genreParam}${langParam}${yearParam}&page=${page}`;
        cacheKey = `discover_${selectedSort}_${selectedGenre}_${selectedLanguage}_${selectedYear}_page_${page}`;
      }

      try {
        const data = await fetchFromTMDB(endpoint, cacheKey);
        const newMovies = data.results || [];

        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const filtered = newMovies.filter((m) => !existingIds.has(m.id));
          return page === 1 ? filtered : [...prev, ...filtered];
        });

        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("TMDB Fetch Failed:", error);
      }
    };

    fetchData();
  }, [
    selectedGenre,
    selectedLanguage,
    selectedYear,
    selectedSort,
    debouncedQuery,
    searchMode,
    page,
  ]);

  // Reset page and movies when filters, search mode, or query changes
  useEffect(() => {
    // Only reset if searchMode or filters actually change
    setPage(1);
    setMovies([]);
  }, [
    selectedGenre,
    selectedLanguage,
    selectedYear,
    selectedSort,
    debouncedQuery,
    searchMode,
  ]);

  const fetchMore = () => setPage((prev) => prev + 1);

  return {
    movies,
    genres,
    selectedGenre,
    setSelectedGenre,
    selectedLanguage,
    setSelectedLanguage,
    selectedYear,
    setSelectedYear,
    selectedSort,
    setSelectedSort,
    query,
    setQuery,
    searchMode,
    setSearchMode,
    fetchMore,
    hasMore,
    filters,
    setFilters,
    selectedMovie,
    setSelectedMovie,
  };
}
