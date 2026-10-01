# ⚡ Multinity Downloader

> **High-speed, zero-ad YouTube Video & MP3 Audio Downloader web application.**

Built with **Node.js, Express, @distube/ytdl-core**, and Vanilla CSS with a modern dark glassmorphic interface.

---

## ✨ Features

- 📹 **HD Video Downloads**: Choose from available video resolutions (1080p, 720p, 480p, 360p) with audio multiplexed into clean `.mp4` format.
- 🎵 **Crystal Clear MP3 Extractor**: Download high-bitrate audio streams directly in `.mp3` format.
- ⚡ **Instant Metadata Inspection**: Paste any YouTube link to fetch high-res thumbnail, title, channel name, duration, and view count.
- 🛡️ **Zero Ads & Zero Tracking**: Completely free, open-source, and privacy-respecting.
- 📱 **Fully Responsive**: Mobile-first design looking sharp across phones, tablets, and desktops.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/i-am-durga/multinity-downloader.git
cd multinity-downloader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
npm start
```
Visit `http://localhost:3000` in your web browser!

---

## 📂 Project Architecture

```
multinity-downloader/
├── server.js              # Express REST API & ytdl streaming backend
├── package.json           # Dependencies and project scripts
├── LICENSE                # GPL-3.0 License
├── README.md              # Documentation
└── public/                # Static frontend client
    ├── index.html         # Modern web layout
    ├── style.css          # Glassmorphism dark mode styles
    └── app.js             # Client-side dynamic downloader controller
```

---

## ⚖️ License
GNU General Public License v3.0 (GPL-3.0). Developed by [Durga Prasad Sah](https://github.com/i-am-durga).