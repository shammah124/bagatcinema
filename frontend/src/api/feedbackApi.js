import API from "./api";

export const feedbackApi = {
  getUserFeedback: async () => {
    const res = await API.get("/feedback");
    return res.data;
  },
  submitFeedback: async ({ movieId, rating, review }) => {
    const res = await API.post("/feedback", { movieId, rating, review });
    return res.data;
  },
  removeFeedback: async (movieId) => {
    await API.delete(`/feedback/${movieId}`);
  },
};
