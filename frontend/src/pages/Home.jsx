// src/pages/Home.jsx
import { useState } from "react";
import HomeBanner from "../components/HomeBanner";
import FeaturedMovies from "../components/FeaturedMovies";
import TrendingMovies from "../components/TrendingMovies";
import SocialConnectSection from "../social/SocialConnectSection";

export default function Home() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  return (
    <div className="bg-gray-900 text-white pt-16 pb-16 min-h-screen">
      <HomeBanner query={query} setQuery={setQuery} />
      <TrendingMovies query={trimmedQuery} />
      <FeaturedMovies />
      <SocialConnectSection />
    </div>
  );
}
