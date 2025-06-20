import { useEffect, useState } from "react";

const genreOptions = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Animation",
];

const languageOptions = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "hi", label: "Hindi" },
  { code: "yo", label: "Yoruba" },
  { code: "ig", label: "Igbo" },
  { code: "ha", label: "Hausa" },
];

export default function UserProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    genres: [],
    preferredLanguage: "",
    notifications: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("bagatcinemaUserInfo");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "genres") {
      const updatedGenres = formData.genres.includes(value)
        ? formData.genres.filter((g) => g !== value)
        : [...formData.genres, value];
      setFormData((prev) => ({ ...prev, genres: updatedGenres }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("bagatcinemaUserInfo", JSON.stringify(formData));
    alert(
      "Profile saved successfully! Personalized recommendations will update."
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12 pt-[80px] max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
        Your Profile Settings
      </h2>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email or Username
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="example@domain.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="country" className="block mb-1 font-semibold">
            Country
          </label>
          <input
            id="country"
            type="text"
            name="country"
            placeholder="Nigeria"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <p className="font-semibold mb-2">Preferred Genres:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genreOptions.map((genre) => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="genres"
                  value={genre}
                  checked={formData.genres.includes(genre)}
                  onChange={handleChange}
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="preferredLanguage"
            className="block mb-2 font-semibold">
            Preferred Language:
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="">Select Language</option>
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="notifications"
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
          />
          <label htmlFor="notifications" className="font-medium">
            Enable Notifications
          </label>
        </div>

        <button
          onClick={handleSave}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-md transition w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
}
