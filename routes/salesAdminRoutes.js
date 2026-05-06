import express from "express";
import SalesLead from "../models/salesModel.js";
import { sendEmail } from "../server.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 admin middleware
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

// GET all leads
router.get("/", checkAdmin, async (req, res) => {
  try {
    const leads = await SalesLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error("Sales fetch error:", err);
    res.status(500).json({ message: "Failed to fetch sales leads" });
  }
});

// UPDATE status
router.put("/:id", checkAdmin, async (req, res) => {
  try {
    const updated = await SalesLead.findByIdAndUpdate(
      req.params.id,
      { leadStatus: req.body.leadStatus },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Sales update error:", err);
    res.status(500).json({ message: "Failed to update lead" });
  }
});
// ========================
// REPLY TO SALES LEAD
// ========================
router.post("/reply", checkAdmin, async (req, res) => {
  const { email, message, subject } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "Missing email or message" });
  }

  try {
    await sendEmail({
      to: email,
      subject: subject || "Eyenet Uganda - Sales Inquiry Response",
      html: `
        <div style="font-family: Arial; line-height: 1.6;">
          <h2 style="color:#0B1A2A;">Eyenet Sales Team</h2>
          <p>${message}</p>
          <hr/>
          <p style="font-size:12px;color:gray;">
            This is a response from Eyenet Uganda Sales Team.
          </p>
        </div>
      `,
    });

    return res.json({ message: "Reply sent successfully" });

  } catch (err) {
    console.error("Sales reply error:", err);
    return res.status(500).json({ message: "Failed to send reply" });
  }
});

export default router;