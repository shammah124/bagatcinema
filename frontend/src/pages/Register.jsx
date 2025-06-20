import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import allCountries from "../utils/countries.json";
import SuccessPopup from "../components/SuccessPopup";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    genres: [],
    country: "",
    preferredLanguage: "",
    mood: "",
    favoriteActor: "",
    watchFrequency: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

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

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "notifications") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const genres = checked
        ? [...prev.genres, value]
        : prev.genres.filter((g) => g !== value);
      return { ...prev, genres };
    });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password);

  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopupMessage("");

    const { name, email, password, confirmPassword, dob } = form;

    if (!name || !email || !password || !confirmPassword || !dob) {
      return setPopupMessage("All required fields must be filled.");
    }

    if (!isValidEmail(email)) {
      return setPopupMessage("Please enter a valid email address.");
    }

    if (!isStrongPassword(password)) {
      return setPopupMessage(
        "Password must be at least 8 characters long and include letters and numbers."
      );
    }

    if (password !== confirmPassword) {
      return setPopupMessage("Passwords do not match.");
    }

    if (getAge(dob) < 15) {
      return setPopupMessage("You must be at least 15 years old to register.");
    }

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 1000)
      );

      const res = await API.post("/auth/register", form);
      const { token, user } = res.data;

      localStorage.setItem(
        "bagatcinemaUserInfo",
        JSON.stringify({ ...user, token })
      );

      setShowSuccess(true);
      login?.(user.email);
      navigate("/dashboard");
    } catch (err) {
      setPopupMessage(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white mt-15 flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-10">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create Your
          <span className="text-yellow-400 md:ml-1">Bagat</span>
          <span className="text-sky-500">Cinema</span> Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="input"
            required
          />
          <select
            name="gender"
            onChange={handleChange}
            className="input"
            required>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            type="date"
            name="dob"
            onChange={handleChange}
            className="input"
            required
          />
          <select
            name="country"
            onChange={handleChange}
            className="input"
            required>
            <option value="">Select Country</option>
            {allCountries.map((country, idx) => (
              <option key={idx} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            name="preferredLanguage"
            onChange={handleChange}
            className="input">
            <option value="">Preferred Language</option>
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
            <option>Arabic</option>
            <option>Hindi</option>
            <option>Yoruba</option>
            <option>Igbo</option>
            <option>Hausa</option>
          </select>
          <input
            type="text"
            name="favoriteActor"
            placeholder="Favorite Actor/Actress"
            onChange={handleChange}
            className="input"
          />
          <select name="mood" onChange={handleChange} className="input">
            <option value="">What’s your mood?</option>
            {moods.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            name="watchFrequency"
            onChange={handleChange}
            className="input">
            <option value="">How often do you watch movies?</option>
            <option>Every day</option>
            <option>Several times a week</option>
            <option>Once a week</option>
            <option>Occasionally</option>
          </select>

          <div className="sm:col-span-2">
            <label className="text-sm text-gray-300 mb-2 block">
              Select Your Favorite Genres:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {genresList.map((genre, idx) => (
                <label key={idx} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={handleCheckboxChange}
                    checked={form.genres.includes(genre)}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-200">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="inline-flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="notifications"
                checked={form.notifications}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span>Enable Email Notifications</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 py-4 rounded-md cursor-pointer w-full">
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessPopup
          message="Registration successful! Welcome to BagatCinema."
          onClose={() => setShowSuccess(false)}
        />
      )}

      {popupMessage && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}
