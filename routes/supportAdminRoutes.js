import express from "express";
import SupportTicket from "../models/supportModel.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET ALL TICKETS
router.get("/", adminOnly, async (req, res) => {
  const tickets = await SupportTicket.find().sort({ createdAt: -1 });
  res.json(tickets);
});

// UPDATE STATUS
router.put("/:id", adminOnly, async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(ticket);
});

// DELETE
router.delete("/:id", adminOnly, async (req, res) => {
  await SupportTicket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;