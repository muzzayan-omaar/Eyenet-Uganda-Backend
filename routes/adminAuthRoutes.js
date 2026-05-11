import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const router = express.Router();
// ========================
// LOGIN
// ========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
 

  try {
    const admin = await Admin.findOne({ email });
 console.log("ADMIN FOUND:", admin);
    // ✅ SAFE CHECK (THIS WAS MISSING)
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
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