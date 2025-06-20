import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const images = [
  "https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  "https://image.tmdb.org/t/p/original/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
  "https://image.tmdb.org/t/p/original/fPGeS6jgdLovQAKunNHX8l0avCy.jpg",
];

export default function HomeBanner({ query, setQuery }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative bg-cover bg-center h-[420px] sm:h-[520px] md:h-[600px] lg:h-[680px] flex flex-col justify-center items-center text-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentImage]})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 max-w-4xl w-full text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Nonstop Action, One Click Away on
          <span className="text-yellow-400"> Bagat</span>
          <span className="text-sky-500">Cinema</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-8">
          Explore trending thrillers and action-packed adventures tailored just
          for you.
        </p>
        <div className="w-full max-w-xl mx-auto">
          <SearchBar query={query} setQuery={setQuery} />
        </div>
      </div>
    </section>
  );
}
