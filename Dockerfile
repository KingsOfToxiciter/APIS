# Use official Node.js image as base
FROM node:18

# Install yt-dlp and dependencies
RUN apt-get update && apt-get install -y ffmpeg wget \
    && wget -q https://github.com/yt-dlp/yt-dlp/releases/download/2025.02.19/yt-dlp -O /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the required port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
