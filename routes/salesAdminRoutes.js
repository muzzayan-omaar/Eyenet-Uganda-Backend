import express from "express";
import SalesLead from "../models/salesModel.js";
import { sendEmail } from "../server.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ========================
// GET LEADS
// ========================
router.get("/", checkAdmin, async (req, res) => {
  try {
    const leads = await SalesLead.find().sort({
      createdAt: -1,
    });

    res.json(leads);

  } catch (err) {
    console.error("Sales fetch error:", err);

    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
});

// ========================
// UPDATE STATUS
// ========================
router.put("/:id", checkAdmin, async (req, res) => {
  try {
    const updated = await SalesLead.findByIdAndUpdate(
      req.params.id,
      {
        leadStatus: req.body.leadStatus,
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("Sales update error:", err);

    res.status(500).json({
      message: "Failed to update lead",
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
        "Sales Inquiry Response - Eyenet Uganda",

      html: `
        <div style="font-family:Arial;">
          <h2>Eyenet Sales Team</h2>

          <p>${message}</p>

          <hr/>

          <p style="font-size:12px;color:gray;">
            Eyenet Uganda Sales Team
          </p>
        </div>
      `,
    });

    res.json({
      message: "Reply sent successfully",
    });

  } catch (err) {
    console.error("Sales reply error:", err);

    res.status(500).json({
      message: "Failed to send reply",
    });
  }
});

export default router;