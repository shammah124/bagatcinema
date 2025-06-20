import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import PersonalizedRecommendations from "./components/PersonalizedRecommendations";
import UserProfileForm from "./components/UserProfileForm";
import RecommendationPage from "./pages/RecommendationPage";
import TrendingMovies from "./components/TrendingMovies";
import { Toaster } from "react-hot-toast";
import Watchlist from "./pages/Watchlist";
import NavBar from "./components/Navbar";

// Social pages
import UserProfilePage from "./social/UserProfilePage";
import PublicListPage from "./social/PublicListPage";

// Protect routes
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Toaster position="top-right" />
        <NavBar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<TrendingMovies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/genre/:genreSlug" element={<RecommendationPage />} />

          {/* Protected Routes */}
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <PersonalizedRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />

          {/* Public Social Routes */}
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/public/:listId" element={<PublicListPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
