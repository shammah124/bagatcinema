// utils/showToast.js
import toast from "react-hot-toast";

const typeStyles = {
  success: {
    iconColor: "#10b981", // emerald
  },
  error: {
    iconColor: "#ef4444", // red
  },
  info: {
    iconColor: "#3b82f6", // blue
  },
  warning: {
    iconColor: "#facc15", // yellow
  },
};

export function showToast(message, type = "info") {
  const style = {
    background: "#1f2937", // gray-800
    color: "#ffffff",
    borderRadius: "999px",
    padding: "10px 20px",
    fontWeight: 600,
  };

  const iconTheme = {
    primary: typeStyles[type]?.iconColor || "#3b82f6", // fallback to blue
    secondary: "#1f2937",
  };

  const toastFn = toast[type] || toast; // fallback to default

  toastFn(message, {
    style,
    iconTheme,
    duration: 3000,
  });
}
