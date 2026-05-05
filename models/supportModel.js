import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: String,
    company: String,
    location: String,
    product: String,
    issueType: String,
    priority: String,
    contactMethod: String,
    message: String,
    accessNotes: String,
    imageUrl: String,
    status: {
      type: String,
      default: "new",
    },
  },
  { timestamps: true }
);

// ✅ FIXED NAME
export default mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", supportSchema);