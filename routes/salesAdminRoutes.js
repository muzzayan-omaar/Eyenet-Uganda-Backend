const salesSchema = new mongoose.Schema({}, { strict: false });
const Sales = mongoose.model("Sales", salesSchema);

router.get("/", async (req, res) => {
  try {
    const data = await Sales.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Sales admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});