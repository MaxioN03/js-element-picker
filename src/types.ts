/**
 * Bounding rect of the element under the cursor (from getBoundingClientRect).
 * Used by the overlay drawer to position and size the highlight.
 */
export interface OverlayPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Function that creates the overlay element shown over the hovered element.
 * Receives the element's position (or null when hiding) and the mouse event.
 * Returned element is placed inside the overlay wrapper; positioning is handled by the library.
 *
 * @param position - Element's bounding rect, or null when overlay is hidden
 * @param event - The MouseEvent that triggered the update, or null
 * @returns The DOM element to display as the overlay (e.g. a styled div)
 */
export type OverlayDrawer = (
  position: OverlayPosition | null,
  event: MouseEvent | null,
) => Element;

/**
 * Called whenever the element under the cursor changes (hover).
 *
 * @param target - The DOM element currently under the cursor
 * @param event - The MouseEvent
 */
export type OnTargetChange = (target: Element, event: MouseEvent) => void;

/**
 * Called when the user clicks the element under the cursor (selection).
 *
 * @param target - The DOM element that was clicked
 * @param event - The MouseEvent
 */
export type OnClick = (target: Element, event: MouseEvent) => void;

/**
 * Configuration options for {@link ElementPicker}.
 */
export interface ElementPickerOptions {
  /**
   * If `true`, picking starts immediately after initialization.
   * Otherwise use {@link ElementPicker.startPicking} to start (e.g. on button click).
   * @default false
   */
  picking?: boolean;

  /**
   * Restrict picking to this container (e.g. a specific div or iframe's document).
   * If omitted, picking happens over the whole document.
   */
  container?: Element | Document;

  /**
   * Custom function to draw the overlay for the hovered element.
   * If omitted, a default semi-transparent blue overlay is used.
   */
  overlayDrawer?: OverlayDrawer;

  /**
   * Called every time the hovered element changes (mouse moves over a different element).
   */
  onTargetChange?: OnTargetChange;

  /**
   * Called when the user clicks on the currently hovered element (element selected).
   */
  onClick?: OnClick;
}
