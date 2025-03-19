const express = require("express");
const { execFile } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/hasan", (req, res) => {
    const videoUrl = req.query.url;
    const format = req.query.format || "b";

    if (!videoUrl) {
        return res.status(400).json({ error: "Invalid or missing URL" });
    }

    
    execFile("yt-dlp", ["-f", format, "--get-url", videoUrl], (error, stdout, stderr) => {
        if (error || stderr) {
            return res.status(500).json({ error: "Failed to fetch video", details: stderr || error.message });
        }

        const videoLink = stdout.trim();
        if (!videoLink) {
            return res.status(500).json({ error: "Could not extract video link" });
        }
        res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
        request(videoLink).pipe(res);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
