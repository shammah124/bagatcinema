// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/recommendations", recommendationRoutes);

// MongoDB Connection
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MONGO_URI in environment variables");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

startServer();
