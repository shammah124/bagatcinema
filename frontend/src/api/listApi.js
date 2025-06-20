import API from "./api";

export const listApi = {
  createList: async (payload) => {
    const res = await API.post("/lists", payload);
    return res.data;
  },
  getListById: async (id) => {
    const res = await API.get(`/lists/${id}`);
    return res.data;
  },
  incrementListView: async (id) => {
    await API.post(`/lists/${id}/view`);
  },
  incrementListShare: async (id) => {
    await API.post(`/lists/${id}/share`);
  },
};
