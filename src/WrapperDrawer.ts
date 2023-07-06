export interface IWrapperDrawer {
  wrapper: HTMLElement | null;
  draw: (
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    event?: MouseEvent | null
  ) => void;
}

export class WrapperDrawer implements IWrapperDrawer {
  wrapper: HTMLElement | null = null;
  overlayDrawer?:
    | ((
        position?: {
          x: number;
          y: number;
          width: number;
          height: number;
        } | null,
        event?: MouseEvent | null
      ) => Element)
    | null = null;

  constructor(
    overlayDrawer?: (
      position?: { x: number; y: number; width: number; height: number } | null,
      event?: MouseEvent | null
    ) => Element
  ) {
    this.initialize();
    document.body.appendChild(this.wrapper as Node);
    this.overlayDrawer = overlayDrawer ?? this.defaultOverlayDrawer;
  }

  private initialize() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'fixed';
    this.wrapper.style.display = 'none';
    this.wrapper.style.pointerEvents = 'none';
    this.wrapper.style.zIndex = '99999';
  }

  private defaultOverlayDrawer = () => {
    const defaultOverlay = document.createElement('div');
    defaultOverlay.style.width = '100%';
    defaultOverlay.style.height = '100%';
    defaultOverlay.style.background = 'rgba(255, 0, 0, 0.5)';
    return defaultOverlay;
  };

  draw(
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    event?: MouseEvent | null
  ) {
    if (!this.wrapper) {
      return;
    }

    this.wrapper.innerHTML = '';

    const overlay = this.overlayDrawer?.(position, event) as Element;
    this.wrapper.append(overlay);

    if (position) {
      const { x, y, width, height } = position;
      this.wrapper.style.left = `${x}px`;
      this.wrapper.style.top = `${y}px`;
      this.wrapper.style.width = `${width}px`;
      this.wrapper.style.height = `${height}px`;
      this.wrapper.style.display = 'block';
    } else {
      this.wrapper.style.display = 'none';
    }
  }
}
