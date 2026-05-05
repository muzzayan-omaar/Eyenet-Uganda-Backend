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
    imageUrl: String, // (after upload handling)
    status: {
      type: String,
      default: "new", // new | in-progress | resolved
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportSchema);