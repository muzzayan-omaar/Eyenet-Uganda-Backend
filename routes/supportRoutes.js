import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Support Schema (temporary inline for now)
const supportSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    company: String,
    product: String,
    issueType: String,
    priority: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

const Support =
  mongoose.models.Support || mongoose.model("Support", supportSchema);

router.post("/", async (req, res) => {
  try {
    console.log("SUPPORT BODY:", req.body);

    const newSupport = await Support.create(req.body);

    res.status(200).json({
      message: "Support request saved successfully",
      data: newSupport,
    });
  } catch (err) {
    console.error("Support save error:", err);
    res.status(500).json({ message: "Failed to save support request" });
  }
});

export default router;