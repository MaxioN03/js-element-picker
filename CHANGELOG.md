# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.0] — 2026-04-19

### Added

- `destroy()` method — permanently tears down the picker, removes the overlay from the DOM, and prevents further use
- `isPicking` readonly getter — exposes current picking state without requiring external tracking
- `filter` constructor option — predicate `(element: Element) => boolean` to exclude specific elements from highlighting and callbacks
- `onCancel` constructor option — callback fired when the user presses Escape; picking is stopped automatically
- Overlay auto-repositions on scroll and window resize while picking is active

### Changed

- Moved type definitions to a dedicated `types.ts` file
- Bumped dev dependency versions

## [1.0.0] — 2025-04-16

### Added

- Initial stable release
- `ElementPicker` class with `startPicking()` and `stopPicking()` methods
- `picking` option to start picking immediately on initialization
- `container` option to restrict picking to a specific DOM subtree
- `overlayDrawer` option for custom overlay rendering
- `onTargetChange` callback — fires when the hovered element changes
- `onClick` callback — fires when the user clicks a picked element
- Default semi-transparent blue overlay
- Full test suite (Jest + jsdom)

## [0.x] — 2023-07-04 to 2023-07-11

### Added

- `container` support — pick elements inside a custom container
- `overlayDrawer` support — custom overlay rendering function
- Mouse event passed to every callback
- React wrapper (`react-js-element-picker`) reference in docs

### Fixed

- Removed `stopPicking()` call on click (let caller decide)
- Type fixes across multiple iterations
