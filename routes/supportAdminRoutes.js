import express from "express";
import SupportTicket from "../models/supportModel.js";

const router = express.Router();

// GET all support tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

export default router;