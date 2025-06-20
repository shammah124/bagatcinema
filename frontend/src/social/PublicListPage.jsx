import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socialApi } from "../api/socialApi";

export default function PublicListPage() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const MOVIES_PER_PAGE = 8;

  useEffect(() => {
    loadListData();
  }, [listId]);

  const loadListData = async () => {
    try {
      const data = await socialApi.getListById(listId);
      setList(data);

      const followStatus = await socialApi.checkFollowStatus(data.owner.id);
      setIsFollowing(followStatus);
    } catch (err) {
      console.error("Error loading list:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleFollow = async () => {
    try {
      if (!list) return;

      if (isFollowing) {
        await socialApi.unfollowUser(list.owner.id);
      } else {
        await socialApi.followUser(list.owner.id);
      }

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const renderMovieCard = (movie) => (
    <div
      key={movie.id}
      className="bg-gray-100 p-3 rounded shadow hover:shadow-md transition text-center">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={movie.title}
          className="rounded mb-2 w-full h-40 object-cover"
        />
      ) : (
        <div className="h-40 bg-gray-300 rounded flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      <p className="font-semibold text-gray-800 truncate">{movie.title}</p>
      <p className="text-xs text-gray-500">({movie.year})</p>
    </div>
  );

  if (loading)
    return <div className="text-center py-20 text-gray-600">Loading...</div>;

  if (!list)
    return <div className="text-center py-20 text-red-600">List not found</div>;

  const totalPages = Math.ceil(list.movies.length / MOVIES_PER_PAGE);
  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const currentMovies = list.movies.slice(
    startIndex,
    startIndex + MOVIES_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline text-sm font-medium flex items-center">
        <span className="mr-1">←</span> Back
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{list.title}</h2>
          <p className="text-gray-600">
            By <span className="font-semibold">{list.owner.username}</span>
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleToggleFollow}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              isFollowing
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
            Share List
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {currentMovies.map(renderMovieCard)}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            Prev
          </button>
          <span className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
