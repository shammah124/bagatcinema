import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({
  movies = [],
  onSelect = () => {},
  lastRef,
  showWatchlistButton = false,
  savedMovies = [],
  onToggleWatchlist = () => {},
  query = "",
}) {
  if (!Array.isArray(movies) || movies.length === 0) return null;

  const seenIds = new Set();

  const filteredMovies = movies.filter(
    (movie) => movie && movie.poster_path // ensure safe rendering
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {filteredMovies.map((movie, idx) => {
        // Ensure unique keys
        let uniqueKey = movie.id;
        if (seenIds.has(movie.id)) {
          uniqueKey = `${movie.id}_${idx}`;
        }
        seenIds.add(movie.id);

        const isLast = idx === filteredMovies.length - 1;
        const isSaved = savedMovies.some((m) => m.id === movie.id);

        return (
          <div
            key={uniqueKey}
            ref={isLast && typeof lastRef === "function" ? lastRef : null}>
            <MovieCard
              movie={movie}
              onClick={() => onSelect(movie)}
              showWatchlist={showWatchlistButton}
              isSaved={isSaved}
              onToggleWatchlist={onToggleWatchlist}
              query={query}
            />
          </div>
        );
      })}
    </div>
  );
}
