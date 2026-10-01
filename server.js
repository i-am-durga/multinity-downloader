const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch video information
app.get('/api/info', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  try {
    const isValid = ytdl.validateURL(videoUrl);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(videoUrl);
    const videoDetails = info.videoDetails;

    // Filter available formats
    const formats = info.formats
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel || 'Standard',
        container: f.container,
        hasAudio: f.hasAudio,
        hasVideo: f.hasVideo
      }));

    // Audio-only formats
    const audioFormats = info.formats
      .filter(f => !f.hasVideo && f.hasAudio)
      .map(f => ({
        itag: f.itag,
        audioBitrate: f.audioBitrate,
        container: f.container
      }));

    res.json({
      title: videoDetails.title,
      author: videoDetails.author.name,
      lengthSeconds: videoDetails.lengthSeconds,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      viewCount: videoDetails.viewCount,
      formats,
      audioFormats
    });
  } catch (err) {
    console.error('Error fetching info:', err.message);
    res.status(500).json({ error: 'Failed to retrieve video information. Please check the URL or try again later.' });
  }
});

// Download endpoint
app.get('/api/download', async (req, res) => {
  const { url, itag, type } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send('Invalid or missing YouTube URL');
  }

  try {
    const info = await ytdl.getInfo(url);
    const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s.-]/gi, '_');

    if (type === 'audio') {
      res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp3"`);
      res.header('Content-Type', 'audio/mpeg');
      ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
    } else {
      res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);
      res.header('Content-Type', 'video/mp4');
      const downloadOptions = itag ? { quality: itag } : { quality: 'highest', filter: 'audioandvideo' };
      ytdl(url, downloadOptions).pipe(res);
    }
  } catch (err) {
    console.error('Download stream error:', err.message);
    if (!res.headersSent) {
      res.status(500).send('Download stream failed');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Multinity Downloader is running on http://localhost:${PORT}`);
});