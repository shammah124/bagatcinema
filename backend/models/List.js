import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Movie ID is required"],
  },
  title: {
    type: String,
    required: [true, "Movie title is required"],
  },
  year: {
    type: Number,
    min: 1888,
  },
  poster: String,
});

const listSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "List title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    movies: {
      type: [movieSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "List must contain at least one movie",
      },
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model("List", listSchema);

export default List;
