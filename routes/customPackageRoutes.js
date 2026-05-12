import express from "express";
import CustomPackage from "../models/customPackageModel.js";

const router = express.Router();

// CREATE REQUEST
router.post("/", async (req, res) => {
  try {
    const request = await CustomPackage.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL (ADMIN)
router.get("/", async (req, res) => {
  try {
    const requests = await CustomPackage.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS / REPLY
router.put("/:id", async (req, res) => {
  try {
    const updated = await CustomPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;