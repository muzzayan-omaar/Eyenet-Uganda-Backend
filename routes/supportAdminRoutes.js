import express from "express";
import SupportTicket from "../models/supportModel.js";
import { sendEmail } from "../server.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ========================
// ADMIN AUTH (ONLY ONCE)
// ========================


const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
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
// ========================
// SEND REPLY EMAIL (FIXED VERSION)
// ========================
router.post("/reply", checkAdmin, async (req, res) => {
  const { email, message, subject } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Missing email or message" });
  }

  try {
    const result = await sendEmail({
      to: email,
      subject: subject || "Support Response - Eyenet Uganda",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#0B1A2A;">Eyenet Support Response</h2>

          <p>${message}</p>

          <hr/>

          <p style="font-size:12px;color:gray;">
            Eyenet Uganda Support Team
          </p>
        </div>
      `,
    });

    if (!result) {
      return res.status(500).json({
        message: "Email failed (Resend error)",
      });
    }

    return res.json({
      message: "Reply sent successfully",
    });

  } catch (err) {
    console.error("Reply error:", err);
    return res.status(500).json({
      message: "Server error sending email",
    });
  }
});

export default router;