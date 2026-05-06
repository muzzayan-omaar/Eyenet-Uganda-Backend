import express from "express";
import multer from "multer";
import SupportTicket from "../models/supportModel.js";

const router = express.Router();

// ========================
// MULTER SETUP
// ========================
const storage = multer.memoryStorage(); // store in memory (you can later upload to Cloudinary)
const upload = multer({ storage });

// ========================
// POST SUPPORT REQUEST
// ========================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📥 RAW BODY:", req.body);
    console.log("📥 FILE:", req.file);

    const {
      fullName,
      phone,
      email,
      company,
      location,
      product,
      issueType,
      priority,
      contactMethod,
      message,
      accessNotes,
    } = req.body;

    const newTicket = await SupportTicket.create({
      fullName,
      phone,
      email,
      company,
      location,
      product,
      issueType,
      priority,
      contactMethod,
      message,
      accessNotes,
      imageUrl: req.file ? "uploaded-image-placeholder" : "", // later replace with Cloudinary
    });

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