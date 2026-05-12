import mongoose from "mongoose";

const customPackageSchema = new mongoose.Schema(
  {
    userEmail: String,
    userPhone: String,

    items: [
      {
        title: String,
        price: Number,
      },
    ],

    totalPrice: Number,

    message: String, // optional user note

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Replied", "Approved"],
    },

    adminReply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomPackage", customPackageSchema);