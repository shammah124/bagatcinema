// src/social/UserLists.js
import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function UserLists({ userId }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await API.get(`/user/${userId}`);
        const user = res.data;
        const publicLists = (user.lists || []).filter(
          (l) => l.isPublic !== false
        ); // default to public if not specified
        setLists(publicLists);
      } catch (err) {
        console.error("Failed to fetch user lists:", err);
        toast.error("Could not load user lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userId]);

  const handleShare = (listId) => {
    const link = `${window.location.origin}/public/${listId}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied!");
  };

  if (loading) {
    return <p className="text-white p-4">Loading user lists...</p>;
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Public Lists</h2>
      {lists.length === 0 ? (
        <p className="text-gray-400">No public lists found.</p>
      ) : (
        lists.map((list) => (
          <div
            key={list._id}
            className="mb-4 p-3 border border-gray-700 rounded">
            <h3 className="text-lg font-semibold">{list.title}</h3>
            <p className="italic">{list.description}</p>
            <ul className="list-disc list-inside text-sm mt-2">
              {list.movies.map((movie, index) => (
                <li key={index}>{movie.title}</li>
              ))}
            </ul>
            <button
              onClick={() => handleShare(list._id)}
              className="mt-2 text-blue-400 hover:underline text-sm">
              Share List
            </button>
          </div>
        ))
      )}
    </div>
  );
}
