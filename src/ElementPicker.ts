import { DefaultWrapper } from './DefaultWrapper';
import { PickerWrapper } from './types';

export class ElementPicker {
  private initialized: boolean = false;
  private previousTarget: Element | null = null;
  wrapper: PickerWrapper | null = null;
  onTargetChange: ((target: Element) => void) | null = null;
  onClick: ((target: Element) => void) | null = null;

  constructor({
    picking,
    wrapper,
    onTargetChange,
    onClick,
  }: {
    picking?: boolean;
    wrapper?: PickerWrapper;
    onTargetChange?: (target: Element) => void;
    onClick?: (target: Element) => void;
  }) {
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        this.initialize.bind(this, {
          picking,
          wrapper,
          onTargetChange,
          onClick,
        })
      );
    } else {
      this.initialize({ picking, wrapper, onTargetChange, onClick });
    }
  }

  private initialize({
    picking,
    wrapper,
    onTargetChange,
    onClick,
  }: {
    picking?: boolean;
    wrapper?: PickerWrapper;
    onTargetChange?: (target: Element) => void;
    onClick?: (target: Element) => void;
  }) {
    this.wrapper = wrapper ?? new DefaultWrapper();
    if (onTargetChange) {
      this.onTargetChange = onTargetChange;
    }
    if (onClick) {
      this.onClick = onClick;
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.initialized = true;

    if (picking) {
      this.startPicking();
    }
  }

  private handleMouseMove(event: MouseEvent) {
    const target = event.target as Element;
    const { x, y, width, height } = target?.getBoundingClientRect();

    if (target !== this.previousTarget) {
      if (!this.checkElementIfOddGlobal(target)) {
        this.wrapper?.show({ x, y, width, height }, target);
        this.onTargetChange?.(target);
      } else {
        this.wrapper?.hide();
      }

      this.previousTarget = target;
    }
  }

  private handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.stopPicking();
    this.onClick?.(event.target as Element);
  }

  private waitForInitialization() {
    const CHECK_INTERVAl = 100;

    return new Promise((resolve) => {
      if (this.initialized) {
        resolve(true);
      } else {
        const waitForInitializedInterval = setInterval(() => {
          if (this.initialized) {
            clearInterval(waitForInitializedInterval);
            resolve(true);
          }
        }, CHECK_INTERVAl);
      }
    });
  }

  private checkElementIfOddGlobal(element: Element) {
    return element === document.documentElement || element === document.body;
  }

  async startPicking() {
    await this.waitForInitialization();

    document.addEventListener('click', this.handleClick);
    document.addEventListener('mousemove', this.handleMouseMove, false);
  }

  async stopPicking() {
    await this.waitForInitialization();

    document.removeEventListener('click', this.handleClick, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    this.wrapper?.hide();
  }
}
