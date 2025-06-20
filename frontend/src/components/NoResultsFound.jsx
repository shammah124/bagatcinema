import React from "react";

export default function NoResultsFound({ message = "No movies found." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 animate-fadeIn">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold mb-2">{message}</h2>
      <p className="text-sm sm:text-base max-w-md">
        Try adjusting your filters or searching for something else.
      </p>
    </div>
  );
}
