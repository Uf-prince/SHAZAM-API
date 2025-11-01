import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔹 Default route
app.get("/", (req, res) => {
  res.send("✅ AudioDB API server is running");
});

// 🔹 Song search route
app.get("/song", async (req, res) => {
  try {
    const { artist, title } = req.query;
    if (!artist || !title) {
      return res.json({ success: false, error: "Please provide artist and title" });
    }

    const url = `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(
      artist
    )}&t=${encodeURIComponent(title)}`;

    const { data } = await axios.get(url);

    if (!data.track || data.track.length === 0) {
      return res.json({ success: false, error: "Song not found" });
    }

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
      youtube: info.strMusicVid,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 🔹 Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
