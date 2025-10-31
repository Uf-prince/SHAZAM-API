const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// ✅ Replace this with your actual RapidAPI key
const SHAZAM_API_KEY = "050dc8628cmsh54d79e8c4477fe4p195a5djsnd05a63bf7156";

// Root route
app.get("/", (req, res) => {
  res.send("🎵 Shazam Custom API is running!");
});

// 🎧 Shazam Search Endpoint
app.post("/api/shazam", async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Please provide a song name or lyrics" });

    const options = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: { term, locale: "en-US", offset: "0", limit: "5" },
      headers: {
        "x-rapidapi-key": SHAZAM_API_KEY,
        "x-rapidapi-host": "shazam.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch song info" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
