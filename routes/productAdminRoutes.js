import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

// middleware (reuse yours later JWT)
const checkAdmin = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

// CREATE
router.post("/", checkAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// UPDATE
router.put("/:id", checkAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", checkAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// GET ALL (admin view)
router.get("/", checkAdmin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;