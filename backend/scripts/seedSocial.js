// scripts/seedSocial.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import List from "../models/List.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

try {
  // Clear collections
  await User.deleteMany();
  await List.deleteMany();

  // Create users
  const users = await User.insertMany([
    {
      name: "Shammah",
      email: "shammah@example.com",
      username: "shammy",
      password: await bcrypt.hash("password123", 10),
    },
    {
      name: "Amaka",
      email: "amaka@example.com",
      username: "queen_amaka",
      password: await bcrypt.hash("password123", 10),
    },
    {
      name: "Jide",
      email: "jide@example.com",
      username: "jideflix",
      password: await bcrypt.hash("password123", 10),
    },
  ]);

  const [shammah, amaka, jide] = users;

  // Simulate followers
  shammah.followers.push(amaka._id, jide._id); // both follow Shammah
  amaka.following.push(shammah._id);
  jide.following.push(shammah._id);

  await shammah.save();
  await amaka.save();
  await jide.save();

  // Create lists
  await List.insertMany([
    {
      userId: shammah._id,
      title: "My Action Favorites",
      description: "Top-tier action thrillers you must see.",
      movies: [
        { id: "movie1", title: "John Wick", year: 2014 },
        { id: "movie2", title: "Extraction", year: 2020 },
        { id: "movie3", title: "Gladiator", year: 2000 },
      ],
    },
    {
      userId: amaka._id,
      title: "Rom-Com Heaven",
      description: "Feel-good romantic comedies 💕",
      movies: [
        { id: "movie4", title: "Crazy Rich Asians", year: 2018 },
        { id: "movie5", title: "The Proposal", year: 2009 },
        { id: "movie6", title: "Hitch", year: 2005 },
      ],
    },
  ]);

  console.log("Social data seeded successfully");
  process.exit();
} catch (err) {
  console.error("Seeding failed:", err);
  process.exit(1);
}
