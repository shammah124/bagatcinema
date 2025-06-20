// controllers/userController.js
import User from "../models/User.js";
import Watchlist from "../models/Watchlist.js";
import Feedback from "../models/Feedback.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ ...user.toObject(), id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving profile." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });
    res.json({ ...updatedUser.toObject(), id: updatedUser._id });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile." });
  }
};

export const getUserIds = async (req, res) => {
  try {
    const users = await User.find({}, "_id");
    res.json(users.map((u) => u._id.toString()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user IDs" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.json(users.map((u) => ({ id: u._id, name: u.name, email: u.email })));
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    // const lists = await List.find({ userId: user._id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ ...user.toObject(), id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found." });
    }

    // Delete the user document
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete associated data
    const deletedWatchlist = await Watchlist.deleteMany({ userId });

    const deletedFeedback = await Feedback.deleteMany({ userId });

    res.json({ message: "Account successfully deleted." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
  }
};
