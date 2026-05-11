// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Resend } from "resend";

import supportRoutes from "./routes/supportRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";

import supportAdminRoutes from "./routes/supportAdminRoutes.js";
import salesAdminRoutes from "./routes/salesAdminRoutes.js";
import seedAdminRoute from "./routes/seedAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const resend = new Resend(process.env.RESEND_API_KEY);

// ========================
// Middleware
// ========================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://eyenet-uganda.vercel.app",
  "https://eyenet-uganda-backend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ========================
// MongoDB
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ========================
// Schemas (unchanged)
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
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await resend.emails.send({
      from: "Eyenet Support <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", result);
    return result;
  } catch (err) {
    console.error("❌ Email error:", err);
    return null;
  }
};

// ========================
// ROUTES
// ========================
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/support", supportAdminRoutes);
app.use("/api/admin/sales", salesAdminRoutes);
app.use("/api/admin/seed", seedAdminRoute);
app.use("/api/support", supportRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/seed-admin", seedAdmin);


// ========================
// HEALTH CHECK
// ========================
app.get("/", (req, res) => {
  res.send("API running");
});

// ========================
// NEWSLETTER
// ========================
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    await Subscriber.create({ email });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "New Newsletter Subscription",
      html: `<p>New subscription: ${email}</p>`,
    });

    return res.status(200).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========================
// CONTACT
// ========================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    await Contact.create({ name, email, message });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Contact from ${name}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ message: "Message sent!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========================
// PARTNER
// ========================
app.post("/api/becomepartner", async (req, res) => {
  const {
    companyName,
    contactName,
    email,
    phone,
    businessType,
    territory,
    message,
  } = req.body;

  if (!companyName || !contactName || !email || !businessType) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await Partner.create({
      companyName,
      contactName,
      email,
      phone,
      businessType,
      territory,
      message,
    });

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `New Partner Request - ${companyName}`,
      html: `
        <p><b>Company:</b> ${companyName}</p>
        <p><b>Contact:</b> ${contactName}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message || "-"}</p>
      `,
    });

    return res.status(200).json({ message: "Partner request sent!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});