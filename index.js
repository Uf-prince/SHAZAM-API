const express = require('express');
const axios = require('axios');
const multer = require('multer');

const app = express();
const upload = multer();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SHAZAM_KEY = process.env.SHAZAM_KEY; // Set this in Heroku env
const SHAZAM_HOST = process.env.SHAZAM_HOST || 'shazam.p.rapidapi.com';

app.post('/detect', upload.single('audio'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Audio file required' });

    try {
        const audioBuffer = req.file.buffer;
        const response = await axios.post(
            'https://shazam.p.rapidapi.com/songs/v2/detect',
            audioBuffer,
            {
                headers: {
                    'x-rapidapi-key': SHAZAM_KEY,
                    'x-rapidapi-host': SHAZAM_HOST,
                    'content-type': 'text/plain'
                },
                timeout: 20000
            }
        );

        res.json({ success: true, data: response.data });

    } catch (err) {
        console.error('Shazam API Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Shazam API running on port ${PORT}`);
});
