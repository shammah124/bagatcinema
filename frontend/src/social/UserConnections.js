// src/social/UserConnections.js
import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function UserConnections({ userId }) {
  const [following, setFollowing] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Get full user info for following
        const resFollowing = await API.get("/social/following");
        setFollowing(resFollowing.data || []);

        // Get follower IDs (count route returns { count: number }, but you'll need to fetch users)
        const res = await API.get(`/user/${userId}`);
        const followerIds = res.data.followers || [];

        // Fetch full user data for each follower
        const followerData = await Promise.all(
          followerIds.map(async (id) => {
            try {
              const res = await API.get(`/user/${id}`);
              return res.data;
            } catch {
              return null;
            }
          })
        );

        setFollowersList(followerData.filter(Boolean));
      } catch (err) {
        console.error("Error fetching connections:", err);
        toast.error("Failed to load user connections.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId]);

  if (loading) {
    return <p className="text-white p-4">Loading connections...</p>;
  }

  return (
    <div className="p-4 text-white">
      <h3 className="text-lg font-bold mb-2">Following:</h3>
      {following.length === 0 ? (
        <p className="text-gray-400 italic">Not following anyone yet.</p>
      ) : (
        <ul>
          {following.map((u) => (
            <li key={u._id}>@{u.username}</li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-bold mt-4 mb-2">Followers:</h3>
      {followersList.length === 0 ? (
        <p className="text-gray-400 italic">No followers yet.</p>
      ) : (
        <ul>
          {followersList.map((u) => (
            <li key={u._id}>@{u.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
