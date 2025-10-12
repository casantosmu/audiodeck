# AudioDeck

**A modern, self-hostable web spectrogram analyzer for your music library.**

## What is AudioDeck?

AudioDeck is a self-hosted web application that lets you visually analyze the audio quality of your music files. Think of it as a web-based, modern version of the classic Spek spectrogram analyzer.

Perfect for checking if your "high-quality" FLAC files are genuine or just upconverted low-quality MP3s.

## Why Do I Need This? The Visual Proof

Sometimes audio files aren't what they claim to be. A spectrogram reveals the truth:

| 🟢 **Real FLAC (Lossless)**                                                                               | 🔴 **Fake FLAC (MP3 > FLAC)**                                                                       |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ![Spectrogram of a real FLAC file showing full frequency range](.github/assets/spectrogram-real-flac.png) | ![Spectrogram of a fake FLAC file showing a 16kHz cutoff](.github/assets/spectrogram-fake-flac.png) |
| Full frequency range up to 20-22 kHz                                                                      | Clear frequency cutoff around 16 kHz                                                                |
| Rich, detailed spectrum                                                                                   | "Brick wall" effect above cutoff                                                                    |

If you see a hard cutoff around 16 kHz, someone converted a low-quality MP3 to FLAC. Real lossless audio preserves the full frequency range.

## Key Features

- **🔋 Ultra Lightweight**: Go backend idles at ~15MB RAM
- **⚡ Zero Server Load**: Spectrograms generate 100% in your browser
- **🛡️ Secure by Design**: Path traversal resistant, read-only volume mounts
- **📱 Responsive**: Works perfectly on desktop and mobile
- **🐳 Docker Ready**: Minimal size image
- **🎵 Format Support**: MP3, FLAC, WAV

## Quick Start: Docker Compose

Create a `docker-compose.yaml` file:

```yaml
services:
  audiodeck:
    image: casantosmu/audiodeck
    container_name: audiodeck
    user: "1000:1000"
    restart: unless-stopped
    ports:
      - "4747:4747"
    volumes:
      - /path/to/your/music:/media:ro
```

Then run:

```bash
docker-compose up -d
```

**Important**: Replace `/path/to/your/music` with the actual path to your music library on your server.

## 🎵 Support Artists

This tool is useful for verifying your library's quality, regardless of where your music comes from. However, music is art and artists deserve support. If you discover new artists or love certain tracks, please consider buying their music, merchandise, or attending their concerts.

**LONG LIVE MUSIC!**

## License

This project is licensed under the GNU Affero General Public License v3.0.
