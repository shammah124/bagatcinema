// src/pages/RecommendationPage.jsx
import { useParams, useLocation, Navigate } from "react-router-dom";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import Subscription from "../pages/Subscription";

export default function RecommendationPage() {
  const { genreSlug } = useParams();
  const location = useLocation();
  const pathname = location.pathname;

  const genreMap = {
    action: "Action",
    comedy: "Comedy",
    "box-office": "Box Office",
    family: "Family",
    horror: "Horror",
  };

  // Route: /movies => All genres
  if (pathname === "/movies") {
    return <PersonalizedRecommendations genre="" title="All Movies" />;
  }

  // Route: /plans => Subscription Page
  if (pathname === "/plans") {
    return <Subscription />;
  }

  // Route: /genre/:genreSlug => Specific genre recommendations
  if (pathname.startsWith("/genre/") && genreMap[genreSlug]) {
    const genre = genreMap[genreSlug];
    return (
      <PersonalizedRecommendations genre={genre} title={`${genre} Movies`} />
    );
  }

  // Invalid route or unsupported genre
  return <Navigate to="/" replace />;
}
