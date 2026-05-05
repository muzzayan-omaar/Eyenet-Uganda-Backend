import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const salesSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    company: String,
    product: String,
    budget: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

const Sales =
  mongoose.models.Sales || mongoose.model("Sales", salesSchema);

router.post("/", async (req, res) => {
  try {
    console.log("SALES BODY:", req.body);

    const newSale = await Sales.create(req.body);

    res.status(200).json({
      message: "Sales enquiry saved successfully",
      data: newSale,
    });
  } catch (err) {
    console.error("Sales save error:", err);
    res.status(500).json({ message: "Failed to save sales enquiry" });
  }
});

export default router;