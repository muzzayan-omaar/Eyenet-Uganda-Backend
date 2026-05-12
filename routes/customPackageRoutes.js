import express from "express";
import CustomPackage from "../models/customPackageModel.js";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

// CREATE REQUEST
router.post("/", async (req, res) => {
  try {
    const { userEmail, userPhone, items, totalPrice } = req.body;

    // 1. SAVE TO DATABASE
    const request = await CustomPackage.create(req.body);

    // 2. FORMAT ITEMS FOR EMAIL
    const itemsList = items
      .map(
        (item) =>
          `<li>${item.title} - $${item.price}</li>`
      )
      .join("");

    // 3. SEND EMAIL
    const emailResult = await resend.emails.send({
      from: "Eyenet Uganda <onboarding@resend.dev>",
      to: userEmail,
      subject: "Your Custom Security Quote",
      html: `
        <h2>Thank you for your request</h2>

        <p>We’ve received your custom security package request.</p>

        <h3>Selected Items:</h3>
        <ul>${itemsList}</ul>

        <h3>Total: $${totalPrice}</h3>

        <p>Our team will contact you shortly on WhatsApp or email.</p>
      `,
    });

    console.log("EMAIL RESULT:", emailResult);

    // 4. CHECK EMAIL FAILURES
    if (emailResult.error) {
      console.error("EMAIL ERROR:", emailResult.error);
    }

    // 5. RESPONSE
    res.status(201).json({
      message: "Request created and email sent",
      request,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL (ADMIN)
router.get("/", async (req, res) => {
  try {
    const requests = await CustomPackage.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS / REPLY
router.put("/:id", async (req, res) => {
  try {
    const updated = await CustomPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;