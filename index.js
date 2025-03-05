const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const YT_API_KEY = "AIzaSyAr5vEmnvwtmZmGODjCIZqmCGa9KXKEEdk"; // YouTube API Key from .env

app.use(cors());

app.get("/search", async (req, res) => {
    const songName = req.query.songName;
    
    if (!songName) {
        return res.status(400).json({ error: "songName প্রয়োজন!" });
    }

    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: songName,
                type: "video",
                key: YT_API_KEY,
                maxResults: 1
            }
        });

        // ফলাফল ফরম্যাট করে পাঠানো
        const videos = response.data.items.map(item => ({
            videoId: item.id.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        res.json(videos);
    } catch (error) {
        console.error("YouTube API ত্রুটি:", error.message);
        res.status(500).json({ error: "YouTube API কল করতে সমস্যা হয়েছে।", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server চলছে: http://localhost:${PORT}`);
});
