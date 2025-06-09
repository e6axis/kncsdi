const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const topupSchema = new mongoose.Schema({
  uid: String,
  o_created: String,
  playerid: String,
  zoneid: String,
  amount: String,
  choice: String,
  o_finished: String,
  productid: String,
  status: String,
  game: String,
  invoiceid: String,
  created: { type: Date, default: Date.now },
});

const Topup = mongoose.model("Topup", topupSchema);

app.get("/topups", async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Missing uid" });
  const results = await Topup.find({ uid }).sort({ created: -1 }).limit(10);
  res.json(results);
});

app.post("/topups", async (req, res) => {
  const {
    uid,
    o_created,
    playerid,
    zoneid,
    amount,
    choice,
    o_finished,
    productid,
    status,
    game,
    invoiceid,
  } = req.body;

  if (!uid || !amount || !choice || !productid || !invoiceid)
    return res.status(400).json({ error: "Missing required fields" });

  const newTopup = new Topup({
    uid,
    o_created,
    playerid,
    zoneid,
    amount,
    choice,
    o_finished,
    productid,
    status,
    game,
    invoiceid,
  });

  await newTopup.save();
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("MLBB Recharge API is up ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
