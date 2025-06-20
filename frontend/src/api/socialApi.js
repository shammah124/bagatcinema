import API from "./api";

export const socialApi = {
  followUser: async (userId) => {
    await API.post(`/social/follow/${userId}`);
  },
  unfollowUser: async (userId) => {
    await API.delete(`/social/unfollow/${userId}`);
  },
  getFollowing: async () => {
    const res = await API.get("/social/following");
    return res.data;
  },
  getFollowers: async () => {
    const res = await API.get("/social/followers");
    return res.data;
  },
  getFollowerCount: async (userId) => {
    const res = await API.get(`/social/${userId}/followers/count`);
    return res.data.count;
  },
};
