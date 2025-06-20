import { useState, useEffect } from "react";

export default function SearchBar({ query = "", setQuery, onSearch }) {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    if (setQuery) setQuery(value); // still inform parent
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();

    if (trimmedQuery) {
      if (onSearch) onSearch(trimmedQuery);
      if (setQuery) setQuery(trimmedQuery); // make sure parent is in sync

      // Clear only local input without resetting the parent's search
      setTimeout(() => setLocalQuery(""), 100);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch max-w-xl mx-auto px-4 mt-6 z-10 relative shadow-lg rounded-md overflow-hidden">
      <input
        type="search"
        name="movieSearch"
        value={localQuery}
        onChange={handleChange}
        placeholder="Search movies..."
        className="flex-grow px-5 py-3 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md sm:rounded-none sm:rounded-l-md mb-4 sm:mb-0"
        aria-label="Search movies"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md sm:rounded-none sm:rounded-r-md transition duration-200">
        Search
      </button>
    </form>
  );
}
