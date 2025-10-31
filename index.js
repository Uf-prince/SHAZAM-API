const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎵 Shazam API is live!");
});

app.post("/api/shazam", async (req, res) => {
  const { term } = req.body;
  if (!term) return res.status(400).json({ error: "Missing 'term' in body" });

  try {
    const response = await axios.get("https://shazam.p.rapidapi.com/search", {
      params: { term, locale: "en-US", offset: "0", limit: "5" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "shazam.p.rapidapi.com"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Shazam error:", error.message);
    res.status(200).json({
      error: "Failed to fetch song info. Check API key or plan."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
