import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      country,
      preferredLanguage,
      mood,
      favoriteActor,
      watchFrequency,
      genres,
      notifications,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      preferences: {
        gender,
        dob,
        country,
        preferredLanguage,
        mood,
        favoriteActor,
        watchFrequency,
        genres,
        notifications,
      },
    });

    const token = generateToken(newUser);
    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({ token, user: { ...safeUser, id: safeUser._id } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed.", error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: { ...safeUser, id: safeUser._id } });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ ...user.toObject(), id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to load user." });
  }
};
