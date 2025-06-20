// src/social/FollowButton.js
import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function FollowButton({ currentUserId, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const res = await API.get("/social/following");
        const followingIds = res.data.map((user) => user._id || user.id);
        setIsFollowing(followingIds.includes(targetUserId));
      } catch (err) {
        console.error("Failed to check follow status:", err);
        toast.error("Unable to check follow status.");
      } finally {
        setLoading(false);
      }
    };

    checkFollowing();
  }, [targetUserId]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await API.delete(`/social/unfollow/${targetUserId}`);
        toast.success("Unfollowed successfully");
      } else {
        await API.post(`/social/follow/${targetUserId}`);
        toast.success("Followed successfully");
      }
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <button
        className="px-4 py-2 rounded-full bg-gray-400 text-white"
        disabled>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={toggleFollow}
      className={`px-4 py-2 rounded-full text-white transition ${
        isFollowing
          ? "bg-red-600 hover:bg-red-700"
          : "bg-blue-600 hover:bg-blue-700"
      }`}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
