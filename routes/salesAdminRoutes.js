import express from "express";
import SalesLead from "../models/salesModel.js";

const router = express.Router();

// 🔐 admin middleware
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];

  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  next();
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

export default router;