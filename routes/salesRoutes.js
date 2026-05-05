import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Sales enquiry:", req.body);

    // TODO: save to DB here

    res.status(200).json({
      message: "Sales enquiry received"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;