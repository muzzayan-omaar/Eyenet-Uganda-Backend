import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Dummy in-memory storage (replace with a DB later)
const subscribers = [];

// Routes
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (subscribers.includes(email)) {
    return res.status(400).json({ message: "Email already subscribed" });
  }

  subscribers.push(email);
  return res.status(200).json({ message: "Subscribed successfully!" });
});

// Health check
app.get("/", (req, res) => res.send("Newsletter API running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
