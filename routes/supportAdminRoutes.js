import express from "express";
import SupportTicket from "../models/supportModel.js";
import { sendEmail } from "../server.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ========================
// GET ALL SUPPORT TICKETS
// ========================
router.get("/", checkAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({
      createdAt: -1,
    });

    res.json(tickets);

  } catch (err) {
    console.error("Support fetch error:", err);

    res.status(500).json({
      message: "Failed to fetch support tickets",
    });
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

    res.status(500).json({
      message: "Failed to update ticket",
    });
  }
});

// ========================
// SEND REPLY
// ========================
router.post("/reply", checkAdmin, async (req, res) => {
  const { email, message, subject } = req.body;

  if (!email || !message) {
    return res.status(400).json({
      message: "Missing email or message",
    });
  }

  try {
    await sendEmail({
      to: email,
      subject:
        subject ||
        "Support Response - Eyenet Uganda",

      html: `
        <div style="font-family:Arial;">
          <h2>Eyenet Support</h2>

          <p>${message}</p>

          <hr/>

          <p style="font-size:12px;color:gray;">
            Eyenet Uganda Support Team
          </p>
        </div>
      `,
    });

    res.json({
      message: "Reply sent successfully",
    });

  } catch (err) {
    console.error("Reply error:", err);

    res.status(500).json({
      message: "Failed to send reply",
    });
  }
});

export default router;