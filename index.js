import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.send("✅ Shazam-AudioDB API is running");
});

// /song endpoint to fetch info by artist & title
app.get("/song", async (req, res) => {
  try {
    const { artist, title } = req.query;
    if (!artist || !title)
      return res.json({ success: false, error: "Artist and title are required" });

    const response = await axios.get(
      `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(
        artist
      )}&t=${encodeURIComponent(title)}`
    );

    const data = response.data;

    if (!data.track || data.track.length === 0)
      return res.json({ success: false, error: "Song not found" });

    const info = data.track[0];

    res.json({
      success: true,
      artist: info.strArtist,
      song: info.strTrack,
      album: info.strAlbum,
      genre: info.strGenre,
      mood: info.strMood,
      duration: info.intDuration,
      description: info.strDescriptionEN,
      thumbnail: info.strTrackThumb,
      youtube: info.strMusicVid
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
