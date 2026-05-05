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
      default: "new", // new | contacted | closed
    },

    leadScore: {
      type: Number,
      default: 0, // optional upgrade later
    },
  },
  { timestamps: true }
);

export default mongoose.model("SalesLead", salesSchema);