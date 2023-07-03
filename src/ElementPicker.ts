import { DefaultWrapper } from './DefaultWrapper';
import { PickerWrapper } from './types';

export class ElementPicker {
  initialized: boolean = false;
  wrapper: PickerWrapper | null = null;
  onTargetChange: ((target: any) => void) | null = null;
  onClick: ((target: any) => void) | null = null;
  _previousTarget: any;

  constructor({ picking, wrapper, onTargetChange, onClick }: any) {
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

  initialize({ picking, wrapper, onTargetChange, onClick }: any) {
    this.wrapper = wrapper ?? new DefaultWrapper();
    this.onTargetChange = onTargetChange;
    this.onClick = onClick;
    this._previousTarget = null;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.initialized = true;

    if (picking) {
      this.startPicking();
    }
  }

  handleMouseMove(event: MouseEvent) {
    const target = event.target as Element;
    const { x, y, width, height } = target?.getBoundingClientRect();

    if (target !== this._previousTarget) {
      if (!this.checkElementIfOddGlobal(target)) {
        this.wrapper?.show({ x, y, width, height }, target);
        this.onTargetChange?.(target);
      } else {
        this.wrapper?.hide();
      }

      this._previousTarget = target;
    }
  }

  handleClick(event: any) {
    this.stopPicking();
    this.onClick?.(event.target);
  }

  waitForInitialization() {
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

  checkElementIfOddGlobal(element: any) {
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
