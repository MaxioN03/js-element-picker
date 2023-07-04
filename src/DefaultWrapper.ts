import { PickerWrapper } from './types';

export class DefaultWrapper implements PickerWrapper {
  wrapper: HTMLElement | null = null;

  constructor() {
    this.initialize();
    document.body.appendChild(this.wrapper as Node);
  }

  initialize() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'fixed';
    this.wrapper.style.background = 'rgba(0, 0, 255, 0.5)';
    this.wrapper.style.display = 'none';
    this.wrapper.style.border = '1px solid blue';
    this.wrapper.style.pointerEvents = 'none';
    this.wrapper.style.zIndex = '99999';
  }

  show({
    x,
    y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    if (this.wrapper) {
      this.wrapper.style.left = `${x}px`;
      this.wrapper.style.top = `${y}px`;
      this.wrapper.style.width = `${width - 1}px`;
      this.wrapper.style.height = `${height - 1}px`;
      this.wrapper.style.display = 'block';
    }
  }

  hide() {
    if (this.wrapper) {
      this.wrapper.style.display = 'none';
    }
  }
}
