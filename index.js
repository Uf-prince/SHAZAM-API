import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
const upload = multer();

app.get("/", (req, res) => {
  res.send("✅ Shazam API is running");
});

app.post("/detect", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) 
      return res.json({ success: false, error: "No audio file received" });

    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname || "song.mp3");

    const response = await axios.post(
      "https://shazam-song-recognizer.p.rapidapi.com/recognize",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "shazam-song-recognizer.p.rapidapi.com"
        },
        maxBodyLength: Infinity, // handle large files
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ success: false, error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
