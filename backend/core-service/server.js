require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Accommodation Schema
const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Accommodation Model
const Accommodation = mongoose.model(
  "Accommodation",
  accommodationSchema
);

// =========================
// Routes
// =========================

// GET all accommodations
app.get("/api/accommodations", async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({
      createdAt: -1,
    });

    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch accommodations.",
      error: error.message,
    });
  }
});

// POST create accommodation
app.post("/api/accommodations", async (req, res) => {
  try {
    const accommodation = new Accommodation(req.body);
    const savedAccommodation = await accommodation.save();

    res.status(201).json(savedAccommodation);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create accommodation.",
      error: error.message,
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Tahwissa Core Service API is running 🚀",
  });
});

// Start server
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Core Service running on port ${PORT}`);
});