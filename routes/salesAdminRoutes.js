import express from "express";
import SalesLead from "../models/salesModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const leads = await SalesLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sales leads" });
  }
});

export default router;