import React, { useEffect, useState } from "react";
import {
  saveWatchedMovie,
  saveUserRating,
  getUserRating,
  saveUserReview,
  getUserReview,
} from "../utils/db";
import { showToast } from "../utils/showToast";
import { fetchTrailer } from "../utils/fetchTrailer";

export default function MovieModal({ movie, onClose }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    if (!movie) return;

    setRating(0);
    setReview("");
    setSaved(false);

    saveWatchedMovie(movie);
    getUserRating(movie.id).then((r) => typeof r === "number" && setRating(r));
    getUserReview(movie.id).then((r) =>
      typeof r === "string" ? setReview(r) : r?.review && setReview(r.review)
    );

    fetchTrailer(movie.id).then((url) => setTrailerUrl(url));
  }, [movie]);

  const handleSave = async () => {
    try {
      await saveUserRating(movie.id, rating);
      await saveUserReview(movie.id, review);
      showToast("Feedback saved!", "success");
      setSaved(true);
    } catch (e) {
      showToast("Save failed. Try again.", "error");
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl p-6 relative animate-fadeIn">
          {/* Close Button (now correctly aligned) */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
              aria-label="Close modal"
              title="Close">
              &times;
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-1/3 rounded-lg object-cover"
            />

            {/* Movie Info */}
            <div className="text-white space-y-3 flex-1">
              <h2 className="text-2xl font-bold text-yellow-400">
                {movie.title} ({movie.release_date?.split("-")[0]})
              </h2>

              <p className="text-sm text-gray-300">{movie.overview}</p>
              <p className="text-sm">
                <span className="text-blue-400">Rating:</span>{" "}
                {movie.vote_average} ({movie.vote_count} votes)
              </p>
              <p className="text-sm">
                <span className="text-blue-400">Genres:</span>{" "}
                {movie.genres?.map((g) => g.name).join(", ")}
              </p>
              <p className="text-sm">
                <span className="text-blue-400">Runtime:</span> {movie.runtime}{" "}
                mins
              </p>
              <p className="text-sm">
                <span className="text-blue-400">Language:</span>{" "}
                {movie.original_language?.toUpperCase()}
              </p>

              {/* Rating */}
              <div className="mt-4">
                <label className="block mb-1 text-sm text-gray-300">
                  ⭐ Your Rating
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded bg-gray-800 text-white"
                />
              </div>

              {/* Review */}
              <div className="mt-4">
                <label className="block mb-1 text-sm text-gray-300">
                  💬 Your Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                />
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold">
                    Watch Trailer
                  </a>
                )}
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold">
                  {saved ? "✅ Saved" : "Save Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
