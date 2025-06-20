import API from "./api";

export const recommendationApi = {
  getPersonalized: async () => {
    const res = await API.get("/recommendations");
    return res.data;
  },
};
