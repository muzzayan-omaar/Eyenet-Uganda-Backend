import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["CCTV", "Alarms", "Perimeter", "Access Control", "Intercoms", "Fire Safety", "Others"],
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);