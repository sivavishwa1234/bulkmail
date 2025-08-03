const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/fruitsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fruitSchema = new mongoose.Schema({
  name: String,
  cost: Number,
});

const Fruit = mongoose.model("fruit", fruitSchema); // 'fruit' collection

// Get all fruits
app.get("/fruits", async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.json(fruits);
  } catch (err) {
    res.status(500).json({ error: "Error fetching fruits" });
  }
});

// Add a fruit (avoid duplicate names)
app.post("/fruits", async (req, res) => {
  const { name, cost } = req.body;
  if (!name || cost == null) return res.status(400).json({ error: "Missing name or cost" });

  try {
    const exists = await Fruit.findOne({ name });
    if (exists) return res.status(400).json({ error: "Fruit already exists" });

    const fruit = new Fruit({ name, cost });
    await fruit.save();
    res.json({ message: "Fruit added", fruit });
  } catch (err) {
    res.status(500).json({ error: "Error saving fruit" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
