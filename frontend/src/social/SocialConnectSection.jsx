import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { socialApi } from "../api/socialApi";
import { listApi } from "../api/listApi";
import toast from "react-hot-toast";

export default function SocialConnectSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users (excluding the current one) and attach social info
    async function fetchUsers() {
      try {
        const current = await userApi.getCurrentUser();
        const currentUserId = current.id || current._id || current.userId;

        const allIds = await userApi.getAllUserIds(); // Get all user IDs
        const following = await socialApi.getFollowing(); // Get users the current user is following

        const others = await Promise.all(
          allIds
            .filter((id) => id !== currentUserId) // Exclude self
            .map(async (id) => {
              const user = await userApi.getUserById(id);
              const isFollowing = following.some(
                (f) => f._id === id || f.id === id
              );
              const followerCount = await socialApi.getFollowerCount(id);

              return {
                ...user,
                id: user._id,
                isFollowing,
                followerCount,
                lists: (user.lists || []).map((list) => ({
                  ...list,
                  views: list.views || 0,
                  shares: list.shares || 0,
                })),
              };
            })
        );

        setUsers(others);
      } catch (err) {
        // Handle failure if user is not authenticated
        toast.error("Please Sign in for Advanced Features");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers(); // Run on mount
  }, []);

  // Follow or unfollow a user
  const handleFollow = async (userId, follow) => {
    try {
      if (follow) {
        await socialApi.followUser(userId);
        toast.success("Followed!");
      } else {
        await socialApi.unfollowUser(userId);
        toast.success("Unfollowed!");
      }

      // Update local state after follow/unfollow
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isFollowing: follow,
                followerCount: u.followerCount + (follow ? 1 : -1),
              }
            : u
        )
      );
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  // Simulate a view count increment
  const handleFakeView = async (listId) => {
    try {
      await listApi.incrementListView(listId);
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          lists: u.lists.map((l) =>
            l.id === listId ? { ...l, views: (l.views || 0) + 1 } : l
          ),
        }))
      );
    } catch {
      toast.error("Failed to count view.");
    }
  };

  // Simulate a share count increment
  const handleFakeShare = async (listId) => {
    try {
      await listApi.incrementListShare(listId);
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          lists: u.lists.map((l) =>
            l.id === listId ? { ...l, shares: (l.shares || 0) + 1 } : l
          ),
        }))
      );
      toast.success("Thanks for sharing!");
    } catch {
      toast.error("Share failed.");
    }
  };

  // Generate social media share links for a list
  const generateShareLinks = (list) => {
    const message = `Check out this movie list: "${list.title}"\n\n${list.description}`;
    const url = `https://myapp.com/public/${list.id}`;
    const encodedMessage = encodeURIComponent(`${message}\n${url}`);
    return {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      copyLink: url,
    };
  };

  // Show loading or fallback states
  if (loading)
    return (
      <div className="text-center py-10">Loading social connections...</div>
    );
  if (users.length === 0)
    return <div className="text-center py-10">No users available.</div>;

  return (
    <section className="px-4 sm:px-6 lg:px-16 py-12 bg-white text-gray-900">
      {/* Section heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-600">
        Social Connect: Discover & Follow Film Lovers
      </h2>

      {/* Grid of user cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-gray-100 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col items-center text-center transition">
            {/* User avatar */}
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {u.name[0]}
            </div>

            {/* User info */}
            <h3 className="text-lg font-semibold">{u.name}</h3>
            <p className="text-sm text-gray-600">@{u.username}</p>
            <p className="text-sm text-gray-800">
              {u.followerCount} follower{u.followerCount !== 1 ? "s" : ""}
            </p>

            {/* Follow/unfollow button */}
            <button
              onClick={() => handleFollow(u.id, !u.isFollowing)}
              className={`mt-4 px-4 py-2 text-sm rounded-full font-medium shadow-md transition ${
                u.isFollowing
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}>
              {u.isFollowing ? "Unfollow" : "Follow"}
            </button>

            {/* User stats */}
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p>
                👁️ Total Views:{" "}
                {u.lists.reduce((sum, l) => sum + (l.views || 0), 0)}
              </p>
              <p>
                🔄 Total Shares:{" "}
                {u.lists.reduce((sum, l) => sum + (l.shares || 0), 0)}
              </p>
            </div>

            {/* User lists and share buttons */}
            <div className="mt-3 flex flex-col items-center gap-3 w-full">
              {u.lists.map((list) => {
                const shareLinks = generateShareLinks(list);
                return (
                  <div
                    key={list.id}
                    className="w-full bg-white rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-semibold mb-1">{list.title}</p>

                    {/* Share options */}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-2 justify-center text-xs">
                        <button
                          onClick={() => handleFakeView(list.id)}
                          className="bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded-full">
                          👁️ +View
                        </button>

                        <a
                          href={shareLinks.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleFakeShare(list.id)}
                          className="bg-green-200 hover:bg-green-300 px-2 py-1 rounded-full">
                          WhatsApp
                        </a>

                        <a
                          href={shareLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleFakeShare(list.id)}
                          className="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-full">
                          Facebook
                        </a>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareLinks.copyLink);
                            toast.success("Link copied!");
                          }}
                          className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-full">
                          📋 Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
