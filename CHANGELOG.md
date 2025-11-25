# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-11-25

### Added

- Display all detected audio files (unsupported formats disabled).
- Multi-arch Docker build support (`linux/amd64` and `linux/arm64`).
- Add `Cache-Control` header to `GET /v1/audio`. (@Pineapple217)

### Changed

- Decouple frontend assets from backend binary to improve Docker build and caching.
- The spectrogram scale toggle (linear/logarithmic) is now hidden by default due to performance issues. It can be enabled by setting the `ENABLE_LOG_SCALE=true` environment variable.
- Improve spectrogram loading screen UI.
- Disable spectrogram interactivity and autoplay on load.

### Fixed

- Fix blank container rendering delay for large audio files.
- Show specific error message on metadata load failure.

## [1.1.0] - 2025-10-12

### Added

- Spectrogram scale toggle: Switch between linear and logarithmic views.

## [1.0.0] - 2025-10-08

### Added

- Initial release of AudioDeck.
