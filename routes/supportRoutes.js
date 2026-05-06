import express from "express";
import SupportTicket from "../models/supportModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming support request:", req.body);

    const newTicket = await SupportTicket.create(req.body);

    console.log("✅ Saved to DB:", newTicket);

    res.status(201).json({
      message: "Support request submitted successfully",
      data: newTicket,
    });
  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ message: "Failed to save support request" });
  }
});

export default router;