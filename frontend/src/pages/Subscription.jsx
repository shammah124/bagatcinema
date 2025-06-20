import { useState, useEffect } from "react";

export default function Subscription() {
  const storedPlan =
    localStorage.getItem("bagatcinemaCurrentPlan") || "Free Trial";
  const [currentPlan, setCurrentPlan] = useState(storedPlan);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const plans = [
    {
      name: "Free Trial",
      price: "₦0",
      features: ["Limited Access", "Basic Quality", "No Downloads"],
    },
    {
      name: "Premium",
      price: "₦2500/month",
      features: ["Unlimited Movies", "HD Streaming", "Offline Downloads"],
    },
    {
      name: "Family",
      price: "₦4000/month",
      features: ["Up to 4 Screens", "Parental Controls", "Ultra HD"],
    },
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  const confirmUpgrade = () => {
    setCurrentPlan(selectedPlan);
    localStorage.setItem("bagatcinemaCurrentPlan", selectedPlan);
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-20 pt-[80px]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow- mt-5 md:mt-15 mb-6 text-center">
          Manage Your Subscription
        </h1>

        <div className="bg-gray-800 p-6 rounded-lg mb-10 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Current Plan
          </h2>
          <p className="text-gray-300">
            You're currently on the{" "}
            <span className="text-green-400 font-semibold">{currentPlan}</span>{" "}
            plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const isComingSoon =
              plan.name === "Premium" || plan.name === "Family";
            const isCurrent = plan.name === currentPlan;

            return (
              <div
                key={idx}
                className={`border rounded-xl p-6 transition transform hover:scale-105 shadow-xl ${
                  isCurrent ? "border-green-500" : "border-gray-600"
                } bg-gray-800`}>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {plan.name}
                </h3>
                <p className="text-blue-400 font-semibold mb-4">{plan.price}</p>
                <ul className="mb-4 space-y-1 text-sm text-gray-300">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                {isComingSoon && (
                  <p className="text-white text-sm mb-3 text-center">
                    Coming Soon...
                  </p>
                )}

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-300 py-2 rounded-full cursor-not-allowed">
                    Active
                  </button>
                ) : (
                  <button
                    disabled={isComingSoon}
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full py-2 rounded-full font-semibold transition ${
                      isComingSoon
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}>
                    {isComingSoon ? "Unavailable" : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-gray-900 text-white px-8 py-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                Confirm Subscription
              </h2>
              <p className="mb-4">
                Are you sure you want to switch to the{" "}
                <span className="text-blue-400 font-semibold">
                  {selectedPlan}
                </span>{" "}
                plan?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmUpgrade}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full font-semibold">
                  Yes, Upgrade
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
