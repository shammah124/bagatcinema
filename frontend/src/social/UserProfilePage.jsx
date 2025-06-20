import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const { userId } = useParams(); // Get user ID from URL parameters

  // State variables
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUserId === userId; // Check if viewing own profile

  // Fetch user profile and social data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user and target profile user in parallel
        const [{ data: currentUser }, { data: userData }] = await Promise.all([
          API.get("/auth/me"),
          API.get(`/users/${userId}`),
        ]);

        setUser(userData);
        setCurrentUserId(currentUser._id);

        // Fetch followers and following list
        const [{ data: followers }, { data: following }] = await Promise.all([
          API.get("/social/followers"),
          API.get("/social/following"),
        ]);

        // Count how many followers the viewed user has
        setFollowerCount(followers.filter((f) => f._id === userId).length);

        // If it's the user's own profile, show their following list
        if (currentUser._id === userId) {
          setFollowingUsers(following);
        } else {
          // If it's not the user's profile, check if current user follows them
          const isFollowingUser = following.some((u) => u._id === userId);
          setIsFollowing(isFollowingUser);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Could not load profile.");
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchData();
  }, [userId]);

  // Handle follow/unfollow logic
  const handleFollow = useCallback(async () => {
    try {
      if (isFollowing) {
        await API.delete(`/social/unfollow/${userId}`);
        setFollowerCount((prev) => prev - 1);
        toast.success("Unfollowed user");
      } else {
        await API.post(`/social/follow/${userId}`);
        setFollowerCount((prev) => prev + 1);
        toast.success("Now following user");
      }
      setIsFollowing((prev) => !prev); // Toggle follow state
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
      toast.error("Error changing follow state");
    }
  }, [isFollowing, userId]);

  // Handle copying public list link to clipboard
  const handleCopyLink = useCallback((listId) => {
    const link = `${window.location.origin}/public/${listId}`;
    navigator.clipboard.writeText(link);
    toast.success("List link copied to clipboard!");
  }, []);

  // Show loading spinner
  if (loading) return <p className="p-4">Loading profile...</p>;

  // Show error if user not found
  if (!user) return <p className="p-4 text-red-500">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-600">
            {followerCount} follower{followerCount !== 1 && "s"}
          </p>
        </div>

        {/* Show follow/unfollow button if not own profile */}
        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded transition ${
              isFollowing
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Following List (Visible only on own profile) */}
      {isOwnProfile && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Following</h3>
          {followingUsers.length === 0 ? (
            <p className="text-gray-500">You're not following anyone yet.</p>
          ) : (
            <ul className="space-y-2">
              {followingUsers.map((u) => (
                <li key={u._id}>
                  <Link
                    to={`/profile/${u._id}`}
                    className="text-blue-600 hover:underline">
                    {u.name} (@{u.username})
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Public Lists Section */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Public Lists</h3>
        {user.lists?.length === 0 ? (
          <p className="text-gray-500">No public lists available.</p>
        ) : (
          user.lists?.map((list) => (
            <div
              key={list._id}
              className="bg-white rounded shadow p-4 mb-6 border border-gray-200">
              {/* List header with copy and view buttons */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold">{list.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyLink(list._id)}
                    className="text-sm text-blue-600 hover:underline">
                    📋 Copy Link
                  </button>
                  <Link
                    to={`/public/${list._id}`}
                    className="text-sm text-green-600 hover:underline">
                    🔗 View List
                  </Link>
                </div>
              </div>

              {/* List description */}
              <p className="text-gray-600 italic mb-3">{list.description}</p>

              {/* Display movies in the list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {list.movies?.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-100 rounded shadow hover:shadow-md transition p-2">
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="rounded mb-1 w-full h-36 object-cover"
                      />
                    )}
                    <p className="font-semibold text-sm">{movie.title}</p>
                    {movie.year && (
                      <p className="text-xs text-gray-500">({movie.year})</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
