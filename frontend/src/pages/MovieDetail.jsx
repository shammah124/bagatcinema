// src/pages/MovieDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFromTMDB } from "../api/fetchTMDB";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const fallbackPoster = "https://via.placeholder.com/500x750?text=No+Image";

  useEffect(() => {
    if (id) {
      fetchFromTMDB(`/movie/${id}`, `movie_detail_${id}`).then((data) => {
        setMovie(data);
      });
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6 py-10 pt-[80px]">
        <p className="text-gray-400 text-xl animate-pulse">
          Loading movie details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 pt-[80px]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : fallbackPoster
            }
            alt={movie.title}
            className="rounded-lg w-full object-cover max-h-[600px]"
            aria-label="Movie Poster"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-yellow-400">
            {movie.title}{" "}
            <span className="text-gray-400 text-xl">
              ({movie.release_date?.split("-")[0]})
            </span>
          </h1>
          <p className="text-gray-300">{movie.overview}</p>

          <p>
            <span className="text-blue-400 font-semibold">⭐ Rating:</span>{" "}
            {movie.vote_average} / 10 ({movie.vote_count} votes)
          </p>
          <p>
            <span className="text-blue-400 font-semibold">🎬 Genres:</span>{" "}
            {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
          </p>
          <p>
            <span className="text-blue-400 font-semibold">🕒 Runtime:</span>{" "}
            {movie.runtime ? `${movie.runtime} mins` : "N/A"}
          </p>
          <p>
            <span className="text-blue-400 font-semibold">🌐 Language:</span>{" "}
            {movie.original_language?.toUpperCase() || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
