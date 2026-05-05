import express from "express";
const router = express.Router();

// CREATE SUPPORT REQUEST
router.post("/", async (req, res) => {
  try {
    console.log("Support request:", req.body);

    // TODO: save to DB here

    res.status(200).json({
      message: "Support request received"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;