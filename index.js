const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/download", (req, res) => {
    const videoUrl = req.query.url;
    const format = req.query.format || "best";
    if (!videoUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    // yt-dlp দিয়ে ভিডিওর ডাইরেক্ট ডাউনলোড লিংক বের করা
    const command = `/yt-dlp -f ${format} --get-url "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: "Failed to fetch video", details: error.message });
        }

        const videoLink = stdout.trim();
        if (!videoLink) {
            return res.status(500).json({ error: "Could not extract video link" });
        }

        res.json({ videoUrl: videoLink });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});