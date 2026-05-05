import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: String,
    company: String,
    customerType: String,
    location: String,
    product: String,
    budget: String,
    urgency: String,
    contactMethod: String,
    message: String,
    leadStatus: {
      type: String,
      default: "new",
    },
    leadScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.salesModel ||
  mongoose.model("salesModel", salesSchema);