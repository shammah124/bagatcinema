// controllers/socialController.js
import User from "../models/User.js";
import Watchlist from "../models/Watchlist.js";
import List from "../models/List.js";

export const followUser = async (req, res) => {
  const { userId } = req.params;

  if (req.user.id === userId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  const currentUser = await User.findById(req.user.id);
  const targetUser = await User.findById(userId);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  if (!currentUser.following.includes(userId)) {
    currentUser.following.push(userId);
    targetUser.followers.push(currentUser._id);
    await currentUser.save();
    await targetUser.save();
  }

  res.json({ message: `Now following ${targetUser.name}` });
};

export const unfollowUser = async (req, res) => {
  const { userId } = req.params;

  const currentUser = await User.findById(req.user.id);
  const targetUser = await User.findById(userId);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userId
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({ message: `Unfollowed ${targetUser.name}` });
};

export const getFollowing = async (req, res) => {
  const user = await User.findById(req.user.id).populate(
    "following",
    "name email username"
  );
  res.json(user.following);
};

export const getFollowers = async (req, res) => {
  const user = await User.findById(req.user.id).populate(
    "followers",
    "name email username"
  );
  res.json(user.followers);
};

export const getFollowerCount = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ count: user.followers.length });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email username");
    res.json(
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        username: u.username,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserWatchlist = async (req, res) => {
  const { userId } = req.params;
  const watchlist = await Watchlist.find({ userId }).select("movieData -_id");
  res.json(watchlist.map((w) => w.movieData));
};

export const getListById = async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id).populate("userId", "name username");
  if (!list) return res.status(404).json({ message: "List not found" });

  res.json({
    ...list.toObject(),
    owner: {
      id: list.userId._id,
      username: list.userId.username,
      name: list.userId.name,
    },
  });
};

export const incrementListView = async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);
  if (!list) return res.status(404).json({ message: "List not found" });

  list.views += 1;
  await list.save();
  res.json({ success: true });
};

export const incrementListShare = async (req, res) => {
  const { id } = req.params;
  const list = await List.findById(id);
  if (!list) return res.status(404).json({ message: "List not found" });

  list.shares += 1;
  await list.save();
  res.json({ success: true });
};

export const createList = async (req, res) => {
  const { title, description, movies } = req.body;

  const newList = new List({
    userId: req.user.id,
    title,
    description,
    movies,
    views: 0,
    shares: 0,
  });

  await newList.save();
  res.status(201).json(newList);
};
