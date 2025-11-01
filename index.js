import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ SHAZAM AudioDB API running");
});

// Correct route
app.get("/song", async (req, res) => {
  const artist = req.query.artist;
  const title = req.query.title;

  if (!artist || !title)
    return res.json({ success: false, error: "Provide artist and title" });

  try {
    const response = await axios.get(
      `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(
        artist
      )}&t=${encodeURIComponent(title)}`
    );
    const data = response.data;

    if (!data.track) return res.json({ success: false, error: "Song not found" });

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

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
