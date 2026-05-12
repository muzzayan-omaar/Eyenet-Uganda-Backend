import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinary, storage } from "../config/cloudinary.js";
import Product from "../models/productModel.js";

const router = express.Router();

// ======================
// CLOUDINARY STORAGE
// ======================



const upload = multer({ storage });

// ======================
// GET PRODUCTS
// ======================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ======================
// CREATE PRODUCT
// ======================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.create({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        available: req.body.available === "true",

        image: req.file.path,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================
// UPDATE PRODUCT
// ======================

router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const existingProduct = await Product.findById(
        req.params.id
      );

      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const updatedData = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        available: req.body.available === "true",
      };

      if (req.file) {
        updatedData.image = req.file.path;
      }

      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================
// DELETE PRODUCT
// ======================

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;