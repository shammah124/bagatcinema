// src/social/ListDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { socialApi } from "../api/socialApi";
import toast from "react-hot-toast";

export default function ListDetailPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function loadList() {
      try {
        const data = await socialApi.getListById(listId);
        await socialApi.incrementViewCount(listId);
        setViews(data.views + 1);
        setShareCount(data.shares || 0);
        setList(data);

        const currentUser = await socialApi.getCurrentUser();
        setIsOwner(data.owner?.id === currentUser?.id);
      } catch (e) {
        toast.error("Failed to load list");
        console.error("Error loading list:", e);
      } finally {
        setLoading(false);
      }
    }
    loadList();
  }, [listId]);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("List link copied to clipboard!");
      setShareCount((prev) => prev + 1);
      await socialApi.incrementShareCount(listId);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleEdit = () => {
    navigate(`/list/${listId}/edit`);
  };

  if (loading)
    return <div className="text-center py-10">Loading list details...</div>;
  if (!list)
    return (
      <div className="text-center py-10">List not found or unavailable.</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-12 text-gray-900">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2">
        {list.title}
      </h1>
      <p className="text-gray-600 text-sm mb-2 italic">
        Curated by @{list.owner?.username}
      </p>
      <p className="text-base text-gray-700 mb-4">{list.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        👁️ {views} views • 📤 {shareCount} shares
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {list.movies?.map((movie) => (
          <div
            key={movie.id}
            className="bg-white shadow-sm rounded-lg p-3 flex flex-col items-center">
            <img
              src={movie.poster || "/placeholder.jpg"}
              alt={movie.title}
              className="rounded w-full h-48 object-cover mb-2"
            />
            <h4 className="text-sm font-semibold text-center">{movie.title}</h4>
            <p className="text-xs text-gray-500">{movie.year}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center space-y-3">
        <button
          onClick={handleShare}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full">
          Share this List
        </button>

        {isOwner && (
          <button
            onClick={handleEdit}
            className="ml-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-full">
            Edit List
          </button>
        )}
      </div>
    </div>
  );
}
