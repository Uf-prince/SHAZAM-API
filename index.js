const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🎵 Shazam API is live and working!");
});

// ✅ Shazam endpoint
app.post("/api/shazam", async (req, res) => {
  const { term } = req.body;
  if (!term) return res.status(400).json({ error: "Please provide a song name or keyword!" });

  try {
    const response = await axios.get("https://shazam.p.rapidapi.com/search", {
      params: {
        term: term,
        locale: "en-US",
        offset: "0",
        limit: "5"
      },
      headers: {
        "X-RapidAPI-Key": "050dc8628cmsh54d79e8c4477fe4p195a5djsnd05a63bf7156", // 🧩 apni RapidAPI key
        "X-RapidAPI-Host": "shazam.p.rapidapi.com"
      }
    });

    res.json({
      success: true,
      result: response.data
    });
  } catch (error) {
    console.error("❌ Shazam error:", error.message);
    res.json({ error: "Failed to fetch song info. Check API key or plan." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
