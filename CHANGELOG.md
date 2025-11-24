# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-XX-XX

### Added

- The file browser now displays all detected audio files. Unsupported formats are shown as disabled.
- Support for multi-architecture Docker builds (`linux/amd64` and `linux/arm64`).

### Fixed

- Fixed an issue where the spectrogram display would show a blank container before being fully rendered, especially with large audio files.
- The spectrogram is no longer interactive and will not automatically play upon loading.
- Displays a specific error message when audio metadata fails to load.

### Changed

- Optimized Dockerfile to reduce final image size by only copying the compiled binary.
- Enhanced the spectrogram loading screen.
- The spectrogram scale toggle (linear/logarithmic) is now hidden by default due to performance issues. It can be enabled by setting the `ENABLE_LOG_SCALE=true` environment variable.

## [1.1.0] - 2025-10-12

### Added

- Spectrogram scale toggle: Switch between linear and logarithmic views.

## [1.0.0] - 2025-10-08

### Added

- Initial release of AudioDeck.
