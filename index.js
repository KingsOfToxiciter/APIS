const express = require("express");
const { execFile } = require("child_process");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const request = require("request");

const app = express();
app.use(cors());

// Rate limiting (প্রতি IP প্রতি মিনিটে সর্বোচ্চ ১০ অনুরোধ)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 মিনিট
    max: 10,
    message: { error: "Too many requests. Please try again later." }
});
app.use(limiter);

// URL Validation ফাংশন
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

app.get("/download", (req, res) => {
    const videoUrl = req.query.url;
    const format = req.query.format || "b";

    if (!videoUrl || !isValidURL(videoUrl)) {
        return res.status(400).json({ error: "Invalid or missing URL" });
    }

    // yt-dlp দিয়ে ভিডিওর ডাইরেক্ট ডাউনলোড লিংক বের করা
    execFile("yt-dlp", ["-f", format, "--get-url", videoUrl], (error, stdout, stderr) => {
        if (error || stderr) {
            return res.status(500).json({ error: "Failed to fetch video", details: stderr || error.message });
        }

        const videoLink = stdout.trim();
        if (!videoLink) {
            return res.status(500).json({ error: "Could not extract video link" });
        }

        // Response এ ভিডিও ফাইল পাঠানো (ডাউনলোড শুরু হবে)
        res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
        request(videoLink).pipe(res);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});