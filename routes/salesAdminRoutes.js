import express from "express";
import SalesLead from "../models/salesModel.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET ALL LEADS
router.get("/", adminOnly, async (req, res) => {
  const leads = await SalesLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// UPDATE LEAD STATUS
router.put("/:id", adminOnly, async (req, res) => {
  const lead = await SalesLead.findByIdAndUpdate(
    req.params.id,
    {
      leadStatus: req.body.leadStatus,
    },
    { new: true }
  );

  res.json(lead);
});

// DELETE LEAD
router.delete("/:id", adminOnly, async (req, res) => {
  await SalesLead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;