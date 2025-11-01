import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
const upload = multer();

// 🔹 Default route check
app.get("/", (req, res) => {
  res.send("✅ Shazam API is running perfectly!");
});

// 🔹 Detect route
app.post("/detect", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file)
      return res.json({ success: false, error: "No audio file received" });

    const form = new FormData();
    form.append("file", req.file.buffer, "song.mp3");

    // ✅ Free public API endpoint (no RapidAPI key required)
    const options = {
      method: "POST",
      url: "https://shazam-api-free.vercel.app/api/recognize",
      headers: {
        ...form.getHeaders(),
      },
      data: form,
    };

    const response = await axios.request(options);
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
