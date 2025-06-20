import { useState, useEffect } from "react";
import { userApi } from "../api/userApi";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    preferences: {
      country: "",
      genres: [],
      preferredLanguage: "English",
      notifications: true,
      dob: "",
      gender: "",
      mood: "",
      favoriteActor: "",
      watchFrequency: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getProfile();
        setForm({
          name: data.name,
          email: data.email,
          preferences: {
            ...form.preferences,
            ...data.preferences,
          },
        });
      } catch (err) {
        setError("Failed to load profile.");
      }
    };
    fetchUser();
  }, []);

  const genresList = [
    "Action",
    "Drama",
    "Romance",
    "Sci-Fi",
    "Comedy",
    "Thriller",
    "Horror",
  ];

  const moods = [
    "Relaxed",
    "Excited",
    "Curious",
    "Romantic",
    "Scared",
    "Inspired",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in form) {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else if (type === "checkbox" && name === "genres") {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          genres: checked
            ? [...prev.preferences.genres, value]
            : prev.preferences.genres.filter((g) => g !== value),
        },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.preferences.country.trim()) {
      return setError("Name and Country fields cannot be empty.");
    }
    try {
      await userApi.updateProfile({
        name: form.name,
        preferences: form.preferences,
      });
      setIsEditing(false);
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Failed to save profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bagatcinema_token");
    localStorage.removeItem("bagatcinemaUserInfo");
    navigate("/login", { replace: true });
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action is permanent."
    );
    if (!confirmed) return;
    try {
      await userApi.deleteAccount();
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center text-white bg-gray-950 px-6 py-10 pt-[80px] mt-10 sm:mt-16">
      <div className="max-w-4xl w-full bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          User Profile
        </h2>

        {saved && (
          <p className="text-green-400 text-center text-sm">
            Changes saved successfully!
          </p>
        )}
        {error && <ErrorMessage message={error} />}

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="input"
            />
          </div>

          <div>
            <p className="text-lg font-semibold text-white mb-1">Email</p>
            <p className="text-gray-400 text-sm">{form.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-400">Country</label>
            <input
              type="text"
              name="country"
              value={form.preferences.country}
              onChange={handleChange}
              disabled={!isEditing}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Preferred Language</label>
            <select
              name="preferredLanguage"
              value={form.preferences.preferredLanguage}
              onChange={handleChange}
              disabled={!isEditing}
              className="input">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
              <option>Arabic</option>
              <option>Hindi</option>
              <option>Yoruba</option>
              <option>Igbo</option>
              <option>Hausa</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.preferences.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Gender</label>
            <select
              name="gender"
              value={form.preferences.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Current Mood</label>
            <select
              name="mood"
              value={form.preferences.mood}
              onChange={handleChange}
              disabled={!isEditing}
              className="input">
              <option value="">Select Mood</option>
              {moods.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Favorite Actor/Actress
            </label>
            <input
              type="text"
              name="favoriteActor"
              value={form.preferences.favoriteActor}
              onChange={handleChange}
              disabled={!isEditing}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Watch Frequency</label>
            <select
              name="watchFrequency"
              value={form.preferences.watchFrequency}
              onChange={handleChange}
              disabled={!isEditing}
              className="input">
              <option value="">Select Frequency</option>
              <option>Every day</option>
              <option>Several times a week</option>
              <option>Once a week</option>
              <option>Occasionally</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <p className="text-lg font-semibold text-white mb-1">
              Favorite Genres
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {genresList.map((genre, idx) => (
                <label key={idx} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="genres"
                    value={genre}
                    onChange={handleChange}
                    checked={form.preferences.genres.includes(genre)}
                    disabled={!isEditing}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="inline-flex items-center mt-4">
              <input
                type="checkbox"
                name="notifications"
                checked={form.preferences.notifications}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-sm">Enable Email Notifications</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition duration-200 hover:scale-105">
            Logout
          </button>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition duration-200 hover:scale-105">
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full transition duration-200 hover:scale-105">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
