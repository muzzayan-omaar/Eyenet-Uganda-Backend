import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    shortDescription: String,
    description: String,
    price: String,
    category: {
      type: String,
      enum: ["CCTV", "Alarms", "Perimeter"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);