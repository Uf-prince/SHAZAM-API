const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/api/shazam", async (req, res) => {
  const { term } = req.body;
  if (!term) return res.json({ error: "Please provide a search term" });

  try {
    const options = {
      method: "GET",
      url: "https://shazam-song-recognizer.p.rapidapi.com/search",
      params: { term },
      headers: {
        "x-rapidapi-key": "050dc8628cmsh54d79e8c4477fe4p195a5djsnd05a63bf7156", // 🔑 apni key
        "x-rapidapi-host": "shazam-song-recognizer.p.rapidapi.com", // ✅ correct host
      },
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Shazam error:", error.message);
    res.json({ error: "Failed to fetch song info" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
