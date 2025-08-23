// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// ========================
// MongoDB connection
// ========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ========================
// MongoDB Schemas
// ========================
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

const partnerSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  contactTitle: String,
  email: String,
  phone: String,
  businessType: String,
  territory: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Partner = mongoose.model("Partner", partnerSchema);

// ========================
// Nodemailer setup
// ========================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send email
const sendEmail = async ({ subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Eyenet Uganda" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email error:", err);
  }
};

// ========================
// Routes
// ========================

// Health check
app.get("/", (req, res) => res.send("API running"));

// ----------- Newsletter -----------
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already subscribed" });

    await Subscriber.create({ email });

    // Send email notification
    await sendEmail({
      subject: "New Newsletter Subscription",
      html: `<p>New subscription from: ${email}</p>`,
    });

    return res.status(200).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ----------- Contact -----------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await Contact.create({ name, email, message });

    // Send email notification
    await sendEmail({
      subject: `New Contact Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ----------- Become Partner -----------
app.post("/api/becomepartner", async (req, res) => {
  const {
    companyName,
    contactName,
    contactTitle,
    email,
    phone,
    businessType,
    territory,
    message,
  } = req.body;

  if (!companyName || !contactName || !email || !businessType) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    await Partner.create({
      companyName,
      contactName,
      contactTitle,
      email,
      phone,
      businessType,
      territory,
      message,
    });

    // Send email notification
    await sendEmail({
      subject: `New Partnership Request from ${companyName}`,
      html: `<p><strong>Company Name:</strong> ${companyName}</p>
             <p><strong>Contact Name:</strong> ${contactName}</p>
             <p><strong>Contact Title:</strong> ${contactTitle || "-"}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || "-"}</p>
             <p><strong>Business Type:</strong> ${businessType}</p>
             <p><strong>Territory:</strong> ${territory || "-"}</p>
             <p><strong>Message:</strong><br/>${message || "-"}</p>`,
    });

    return res.status(200).json({ message: "Partnership request submitted!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========================
// Start server
// ========================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
