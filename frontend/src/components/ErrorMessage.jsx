// src/components/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
      <p className="text-red-500 bg-red-100 border border-red-300 px-4 py-2 rounded-md text-sm sm:text-base mb-4 leading-relaxed">
        {message}
      </p>
    </div>
  );
}
