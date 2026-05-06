import express from "express";
import SalesLead from "../models/salesModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming sales request:", req.body);

    const newLead = await SalesLead.create(req.body);

    console.log("✅ Saved to DB:", newLead);

    res.status(201).json({
      message: "Sales enquiry submitted successfully",
      data: newLead,
    });
  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ message: "Failed to save sales enquiry" });
  }
});

export default router;