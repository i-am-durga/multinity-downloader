let currentVideoData = null;
let currentFormatType = 'video'; // 'video' or 'audio'

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      document.getElementById('video-url').value = text;
      fetchVideoDetails();
    }
  } catch (err) {
    document.getElementById('video-url').focus();
  }
}

function formatDuration(seconds) {
  const s = parseInt(seconds, 10);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

function formatViews(views) {
  const v = parseInt(views, 10);
  if (isNaN(v)) return '0';
  if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
  return v.toString();
}

function showError(msg) {
  const banner = document.getElementById('error-banner');
  banner.textContent = msg;
  banner.classList.remove('hidden');
}

function clearError() {
  const banner = document.getElementById('error-banner');
  banner.textContent = '';
  banner.classList.add('hidden');
}

async function fetchVideoDetails() {
  const urlInput = document.getElementById('video-url');
  const url = urlInput.value.trim();
  clearError();

  if (!url) {
    showError('Please enter a valid YouTube video URL');
    return;
  }

  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  btnText.textContent = 'Analyzing...';
  btnSpinner.classList.remove('hidden');

  try {
    const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Failed to analyze video');
      return;
    }

    currentVideoData = data;
    renderPreview(data);
  } catch (err) {
    showError('Network error connecting to downloader server');
  } finally {
    btnText.textContent = 'Analyze Video';
    btnSpinner.classList.add('hidden');
  }
}

function renderPreview(data) {
  const preview = document.getElementById('preview-card');
  document.getElementById('video-thumb').src = data.thumbnail;
  document.getElementById('video-duration').textContent = formatDuration(data.lengthSeconds);
  document.getElementById('video-title').textContent = data.title;
  document.getElementById('video-author').textContent = data.author;
  document.getElementById('video-views').textContent = formatViews(data.viewCount);

  // Populate resolution options
  const select = document.getElementById('quality-select');
  select.innerHTML = '<option value="">Best Available Quality (Recommended)</option>';

  if (data.formats && data.formats.length > 0) {
    // Unique resolutions
    const seen = new Set();
    data.formats.forEach(f => {
      if (f.quality && !seen.has(f.quality)) {
        seen.add(f.quality);
        const opt = document.createElement('option');
        opt.value = f.itag;
        opt.textContent = `${f.quality} (${f.container || 'mp4'})`;
        select.appendChild(opt);
      }
    });
  }

  preview.classList.remove('hidden');
  preview.scrollIntoView({ behavior: 'smooth' });
}

function switchFormatTab(type) {
  currentFormatType = type;
  const tabVideo = document.getElementById('tab-video');
  const tabAudio = document.getElementById('tab-audio');
  const videoWrapper = document.getElementById('video-format-container');

  if (type === 'video') {
    tabVideo.classList.add('active');
    tabAudio.classList.remove('active');
    videoWrapper.classList.remove('hidden');
  } else {
    tabAudio.classList.add('active');
    tabVideo.classList.remove('active');
    videoWrapper.classList.add('hidden');
  }
}

function startDownload() {
  const url = document.getElementById('video-url').value.trim();
  if (!url) return;

  const select = document.getElementById('quality-select');
  const itag = select.value;

  let downloadUrl = `/api/download?url=${encodeURIComponent(url)}&type=${currentFormatType}`;
  if (currentFormatType === 'video' && itag) {
    downloadUrl += `&itag=${itag}`;
  }

  // Trigger download via invisible iframe or direct link
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}