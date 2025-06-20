import React from "react";

export default function LoadingSpinner({ message = "Loading movies..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:py-20 text-white min-h-[300px]">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16">
        {/* Spinner Foreground */}
        <div className="absolute inset-0 rounded-full border-4 sm:border-[5px] border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent animate-spin"></div>

        {/* Spinner Background */}
        <div className="absolute inset-0 rounded-full border-4 sm:border-[5px] border-t-gray-600 border-b-gray-600 border-r-transparent border-l-transparent opacity-20"></div>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-gray-400 animate-pulse text-center">
        {message}
      </p>
    </div>
  );
}
