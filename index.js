const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Shazam API endpoint
app.post("/api/shazam", async (req, res) => {
  const { term } = req.body;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  const options = {
    method: "GET",
    url: "https://shazam.p.rapidapi.com/search",
    params: { term: term, locale: "en-US", offset: "0", limit: "5" },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY, // 👈 key env se le raha hai
      "x-rapidapi-host": "shazam.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json({
      success: true,
      data: response.data.tracks?.hits || [],
    });
  } catch (error) {
    console.error("Shazam error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch song info. Check API key or plan." });
  }
});

// Root test
app.get("/", (req, res) => {
  res.send("🎵 Shazam API custom server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
