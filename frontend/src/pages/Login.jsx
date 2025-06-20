import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import API from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem(
        "bagatcinemaUserInfo",
        JSON.stringify({ ...user, token })
      );

      login?.(user.email);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 px-4 py-20 text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-10 border border-blue-600">
        <h2 className="text-2xl font-extrabold text-center mb-2 p-5">
          Welcome Back to
          <span className="text-yellow-400 font-bold ml-1">Bagat</span>
          <span className="text-sky-500 font-bold">Cinema</span>
        </h2>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full bg-gray-700 text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full bg-gray-700 text-white p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 cursor-pointer rounded-md text-white font-semibold transition duration-200">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
