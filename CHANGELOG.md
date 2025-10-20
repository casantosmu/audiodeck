# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-XX-XX

### Added

- The file browser now displays all detected audio files. Unsupported formats are shown as disabled.
- Enhanced the spectrogram loading screen with contextual messages, including a warning for potentially longer waits when using the logarithmic scale and integrated feedback for slow loads.

### Fixed

- Fixed an issue where the spectrogram display would show a blank container before being fully rendered, especially with large audio files.
- The spectrogram is no longer interactive and will not automatically play upon loading.
- Displays a specific error message when audio metadata fails to load.

## [1.1.0] - 2025-10-12

### Added

- Spectrogram scale toggle: Switch between linear and logarithmic views.

## [1.0.0] - 2025-10-08

### Added

- Initial release of AudioDeck.
