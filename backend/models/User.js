// models/User.js
import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    preferredLanguage: {
      type: String,
      default: "English",
    },
    mood: {
      type: String,
      default: "",
    },
    favoriteActor: {
      type: String,
      default: "",
    },
    watchFrequency: {
      type: String,
      enum: [
        "Every day",
        "Several times a week",
        "Once a week",
        "Occasionally",
        "",
      ],
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({}),
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
