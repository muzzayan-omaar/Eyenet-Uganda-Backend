import express from "express";
import SupportTicket from "../models/supportModel.js";

const router = express.Router();

// 🔐 simple admin auth middleware
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
};

// GET all tickets
router.get("/", checkAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Support fetch error:", err);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

// UPDATE status
router.put("/:id", checkAdmin, async (req, res) => {
  try {
    const updated = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Support update error:", err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
});

export default router;