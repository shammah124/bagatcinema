// models/Watchlist.js
import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: { type: String, required: true },
    movieData: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Watchlist", WatchlistSchema);
