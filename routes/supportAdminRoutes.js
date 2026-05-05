import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Example schema (or import from models file if separated)
const supportSchema = new mongoose.Schema({}, { strict: false });
const Support = mongoose.model("Support", supportSchema);

router.get("/", async (req, res) => {
  try {
    const data = await Support.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Support admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;