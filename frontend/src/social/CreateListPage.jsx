// src/social/CreateListPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socialApi } from "../api/socialApi";
import toast from "react-hot-toast";

export default function CreateListPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [movies, setMovies] = useState(""); // comma-separated movie titles
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieList = movies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((title, idx) => ({ id: idx + 1, title, year: "N/A" }));

      const newList = await socialApi.createList({
        title,
        description,
        movies: movieList,
      });

      toast.success("List created successfully!");
      navigate(`/public/${newList.id}`);
    } catch (err) {
      toast.error("Failed to create list");
      console.error("List creation error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700">
        Create New Movie List
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Movie Titles (comma-separated)
          </label>
          <input
            type="text"
            value={movies}
            onChange={(e) => setMovies(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Inception, The Matrix, Titanic"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium">
          Create List
        </button>
      </form>
    </div>
  );
}
