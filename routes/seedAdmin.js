import express from "express";
import Admin from "../models/adminModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: "admin@eyenet.com" });

    if (existing) {
      return res.json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      email: "admin@eyenet.com",
      password: "123456", // keep simple for now
    });

    res.json({ message: "Admin created", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating admin" });
  }
});

export default router;