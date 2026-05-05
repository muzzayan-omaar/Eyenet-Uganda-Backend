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

// IMPORTANT FIX 👇 prevents OverwriteModelError
export default mongoose.models.supportModel ||
  mongoose.model("supportModel", supportSchema);