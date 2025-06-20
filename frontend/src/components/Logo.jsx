export default function Logo({ className = "" }) {
  return (
    <div
      className={`text-1xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${className}`}
      role="img"
      aria-label="BagatCinema Logo">
      🎬
    </div>
  );
}
