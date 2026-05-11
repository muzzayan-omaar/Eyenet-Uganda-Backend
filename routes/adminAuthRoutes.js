import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// simple admin schema (you already have admin in DB, so we just use collection directly)
const Admin = mongoose.model("Admin");

// ========================
// LOGIN
// ========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⚠️ for now plain password (we can hash later)
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;