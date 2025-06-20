import React, { useState, useContext, useRef, useEffect } from "react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function NavBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col leading-tight">
          <Link to="/">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <Logo className="inline-block -ml-1 mt-2 md:-mb-2" />
              <div className=" -ml-4 -mb-1 sm:-ml-5 md:-ml-6">
                <span className="text-yellow-400 md:ml-1">Bagat</span>
                <span className="text-sky-500">Cinema</span>
              </div>
            </h1>
            <p className="text-xs sm:text-sm text-blue-300 italic -mt-3 sm:-mt-4 md:-mt-3">
              Where Movies Find You.
            </p>
          </Link>
        </div>

        <ul className="hidden md:flex items-center font-semibold text-white space-x-6 relative">
          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full transition duration-200 hover:scale-105">
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full transition duration-200 hover:scale-105">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li className="relative flex items-center space-x-3">
              <Link
                to="/watchlist"
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition duration-200 hover:scale-105">
                Watchlist
              </Link>
              <Link
                to="/recommendations"
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition duration-200 hover:scale-105">
                Recommendations
              </Link>
              <div className="relative">
                <button
                  ref={toggleRef}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="px-5 py-2 bg-gray-700 cursor-pointer hover:bg-gray-600 rounded-full transition duration-200 hover:scale-105">
                  Dashboard ▾
                </button>
                {showDropdown && (
                  <ul
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-50 border border-gray-700 py-2 text-sm">
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-700">
                        My Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-700">
                        User Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/subscription"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-700">
                        Subscription
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 cursor-pointer text-red-400 hover:bg-red-700 hover:text-white transition duration-200">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          )}
        </ul>

        <div className="md:hidden ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-xl focus:outline-none"
            aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-3 text-white text-sm font-semibold">
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-center">
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-center">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/watchlist"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded">
                Watchlist
              </Link>
              <Link
                to="/recommendations"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded">
                Recommendations
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded">
                My Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded">
                User Profile
              </Link>
              <Link
                to="/subscription"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 rounded">
                Subscription
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 px-4 py-2 hover:bg-red-700 hover:text-white rounded">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
