import API from "./api";

export const userApi = {
  getCurrentUser: async () => {
    const res = await API.get("/auth/me");
    return res.data;
  },

  deleteAccount: async () => {
    await API.delete("/user/delete");
  },

  getProfile: async () => {
    const res = await API.get("/user/profile");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await API.put("/user/profile", data);
    return res.data;
  },

  getAllUsers: async () => {
    const res = await API.get("/user/all");
    return res.data;
  },

  getAllUserIds: async () => {
    const res = await API.get("/user/ids");
    return res.data;
  },

  getUserById: async (userId) => {
    const res = await API.get(`/user/${userId}`);
    return res.data;
  },
};
