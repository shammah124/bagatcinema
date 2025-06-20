import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("bagatcinemaUserInfo"));
    setUserInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bagatcinema_token");
    localStorage.removeItem("bagatcinemaUserInfo");
    navigate("/login", { replace: true });
  };

  const email = userInfo?.email || "Movie Lover";
  const plan = userInfo?.subscription?.plan || "Free Trial";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6 py-10 pt-[80px]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">
            Welcome to
            <span className="text-sky-500 md:ml-1">Bagat</span>
            <span className="text-yellow-400">Cinema!</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Hello <span className="font-semibold text-white">{email}</span>,
            glad to have you.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-md p-6 space-y-4 mb-10">
          <div>
            <p className="text-lg font-semibold text-white">Account</p>
            <p className="text-gray-400 text-sm">Email: {email}</p>
          </div>

          <div>
            <p className="text-lg font-semibold text-white">Subscription</p>
            <p className="text-gray-400 text-sm">
              Plan: <span className="text-green-400">{plan}</span>
            </p>
            <Link
              to="/subscription"
              className="mt-3 text-sm text-blue-400 hover:underline">
              Upgrade Plan
            </Link>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-200 hover:scale-105">
              Logout
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition duration-200 hover:scale-105">
            Go to Home & Search Movies
          </button>
        </div>
      </div>
    </div>
  );
}
