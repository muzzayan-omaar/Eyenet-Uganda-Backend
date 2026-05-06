import express from "express";
import SupportTicket from "../models/supportModel.js";
import { sendEmail } from "../server.js";

const router = express.Router();

// ========================
// ADMIN AUTH
// ========================
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
};

// ========================
// GET ALL TICKETS
// ========================
router.get("/", checkAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    console.log("TICKETS FROM DB:", tickets);
    res.json(tickets);
  } catch (err) {
    console.error("Support fetch error:", err);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

// ========================
// UPDATE STATUS
// ========================
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

// ========================
// SEND REPLY EMAIL
// ========================
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (!process.env.ADMIN_KEY) {
    console.error("❌ ADMIN_KEY not set in environment variables");
    return res.status(500).json({ message: "Server misconfigured" });
  }

  if (key !== process.env.ADMIN_KEY) {
    console.warn("❌ Unauthorized admin access attempt");
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
};

export default router;