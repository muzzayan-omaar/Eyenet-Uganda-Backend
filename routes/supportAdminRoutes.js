import express from "express";
import SupportTicket from "../models/supportModel.js";
import { sendEmail } from "../server.js";

const router = express.Router();

// ========================
// ADMIN AUTH (ONLY ONCE)
// ========================
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];
    console.log("👉 HEADER RECEIVED:", req.headers["x-admin-key"]);
  console.log("👉 ENV KEY:", process.env.ADMIN_KEY);

  if (!process.env.ADMIN_KEY) {
    console.error("❌ ADMIN_KEY not set");
    return res.status(500).json({ message: "Server misconfigured" });
  }

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
// SEND REPLY EMAIL (OPTIONAL FEATURE)
// ========================
router.post("/reply", checkAdmin, async (req, res) => {
  const { email, message, subject } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Missing email or message" });
  }

  try {
    await sendEmail({
      subject: subject || "Support Response - Eyenet Uganda",
      html: `
        <div style="font-family: Arial; line-height: 1.6;">
          <h2 style="color:#0B1A2A;">Eyenet Support Response</h2>
          <p>${message}</p>
          <hr/>
          <p style="font-size:12px;color:gray;">
            Eyenet Uganda Support Team
          </p>
        </div>
      `,
      to: email,
    });

    return res.json({ message: "Reply sent successfully" });

  } catch (err) {
    console.error("Reply error:", err);
    return res.status(500).json({ message: "Failed to send reply" });
  }
});

export default router;