// src/utils/highlightQuery.js
export default function highlightQuery(text, query) {
  if (!query || !text) return text;

  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // Escape special characters
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-yellow-400 font-semibold">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
