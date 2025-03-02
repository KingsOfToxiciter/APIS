const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const YT_API_KEY = "AIzaSyAr5vEmnvwtmZmGODjCIZqmCGa9KXKEEdk"; // YouTube API Key

app.use(cors());

// YouTube থেকে গান অনুসন্ধান API
app.get("/search", async (req, res) => {
    const songName = req.query.songName;
    
    if (!songName) {
        return res.status(400).json({ error: "songName প্রয়োজন!" });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: "snippet",
                q: songName,
                type: "video",
                key: YT_API_KEY,
                maxResults: 5
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "YouTube API কল করতে সমস্যা হয়েছে।" });
    }
});

app.listen(PORT, () => {
    console.log(`Server চলছে: http://localhost:${PORT}`);
});
