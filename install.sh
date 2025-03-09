#!/bin/bash
mkdir -p /tmp/yt-dlp
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /tmp/yt-dlp/yt-dlp
chmod +x /tmp/yt-dlp/yt-dlp
ls -lah /tmp/yt-dlp/