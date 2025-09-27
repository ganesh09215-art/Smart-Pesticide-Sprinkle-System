import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Serve frontend (point to client folder)
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client")));

// Mock data
let sprayerStatus = "बंद";
let currentIntensity = 50;
let batteryLevel = 85;
let tankLevel = 75;

app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// Status API
app.get("/api/status", (req, res) => {
  res.json({
    status: sprayerStatus,
    battery: batteryLevel,
    tank: tankLevel,
    intensity: currentIntensity,
    lastUpdated: new Date().toLocaleTimeString("hi-IN"),
    summary: {
      time: "2 घंटे 30 मिनट",
      medicine: "15 लीटर",
      area: "7 एकड़",
    },
  });
});

// Command API
app.post("/api/command", (req, res) => {
  const { action, value } = req.body;
  if (action === "start") sprayerStatus = "चालू";
  if (action === "stop") sprayerStatus = "बंद";
  if (action === "setIntensity") currentIntensity = value;
  res.json({ success: true, message: "कमांड सफलतापूर्वक भेजी गई" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
