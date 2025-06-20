import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleComingSoon = (e) => {
    e.preventDefault();
    setShowComingSoon(true);
  };

  const genres = [
    { slug: "action", name: "Action" },
    { slug: "family", name: "Family & Kids" },
    { slug: "comedy", name: "Comedy" },
    { slug: "horror", name: "Horror" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-400 px-6 py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        <div>
          <h3 className="text-white text-2xl font-bold">
            <span className="text-yellow-400 md:ml-1">Bagat</span>
            <span className="text-sky-500">Cinema</span>
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            Your home of movies, series, and streaming entertainment.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Entertainment</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/movies" className="hover:text-white">
                Movies
              </Link>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                Series
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                Documentaries
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                BagatCinema Originals
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Genres</h4>
          <ul className="space-y-2 text-sm">
            {genres.map((genre) => (
              <li key={genre.slug}>
                <Link to="movies" className="hover:text-white">
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">More About Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/subscription" className="hover:text-white">
                Plans & Pricing
              </Link>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                Download App
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                Partnership Deals
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleComingSoon}
                className="hover:text-white">
                BagatCinema Mobile
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact & Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:support@bagatcinema.com"
                className="hover:text-white">
                support@bagatcinema.com
              </a>
            </li>
            <li>
              <a href="tel:+2341234567890" className="hover:text-white">
                +234-123-456-7890
              </a>
            </li>
            <li>
              <Link to="/register" className="hover:text-white">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-10 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-yellow-400">Bagat</span>
        <span className="text-sky-500">Cinema</span>. All rights reserved.
      </div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-11/12 max-w-sm">
            <h2 className="text-lg font-bold text-yellow-400 mb-2">
              Coming Soon
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              This feature is under development. Please check back later.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
