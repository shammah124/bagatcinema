// controllers/listController.js
import List from "../models/List.js";

export const createList = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: "Failed to create list." });
  }
};

export const getListById = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch list." });
  }
};

export const incrementListView = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.views += 1;
    await list.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to increment views." });
  }
};

export const incrementListShare = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.shares += 1;
    await list.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to increment shares." });
  }
};
