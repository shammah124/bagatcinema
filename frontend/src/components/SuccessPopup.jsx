import React from "react";

export default function SuccessPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 text-white px-8 py-6 rounded-xl shadow-2xl w-full max-w-md text-center border border-blue-600 animate-fadeIn">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-2xl font-bold text-yellow-400">
            Bagat<span className="text-sky-500">Cinema</span>
          </h3>
        </div>
        <p className="text-base text-gray-300 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg"
          autoFocus>
          Continue
        </button>
      </div>
    </div>
  );
}
