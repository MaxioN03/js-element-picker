import { IWrapperDrawer, WrapperDrawer } from './WrapperDrawer';

interface ElementPickerProps {
  picking?: boolean;
  container?: Element;
  overlayDrawer?: (
    position?: { x: number; y: number; width: number; height: number } | null,
    event?: MouseEvent | null
  ) => Element;
  onTargetChange?: (target?: Element, event?: MouseEvent) => void;
  onClick?: (target?: Element, event?: MouseEvent) => void;
}

export class ElementPicker {
  private initialized: boolean = false;
  private previousTarget: Element | null = null;
  private wrapperDrawer: IWrapperDrawer | null = null;
  container: Element | Document | null = null;
  onTargetChange: ((target?: Element, event?: MouseEvent) => void) | null =
    null;
  onClick: ((target?: Element, event?: MouseEvent) => void) | null = null;

  constructor(props: ElementPickerProps) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initialize(props);
      });
    } else {
      this.initialize(props);
    }
  }

  private initialize({
    picking,
    container,
    overlayDrawer,
    onTargetChange,
    onClick,
  }: ElementPickerProps) {
    this.container = container ?? document;
    this.wrapperDrawer = new WrapperDrawer(overlayDrawer);
    if (onTargetChange) {
      this.onTargetChange = onTargetChange;
    }
    if (onClick) {
      this.onClick = onClick;
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);

    if (picking) {
      this.startPicking();
    }

    this.initialized = true;
  }

  private handleMouseMove(event: MouseEvent) {
    const target = event.target as Element;
    const { x, y, width, height } = target?.getBoundingClientRect();

    if (target !== this.previousTarget) {
      if (!this.checkElementIfOddGlobal(target)) {
        this.wrapperDrawer?.draw({ x, y, width, height }, event);
        this.onTargetChange?.(target, event);
      } else {
        this.wrapperDrawer?.draw(null, null);
      }

      this.previousTarget = target;
    }
  }

  private handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.stopPicking();
    this.onClick?.(event.target as Element, event);
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

    const container = this.container as HTMLElement;

    container.addEventListener('click', this.handleClick, false);
    container.addEventListener('mousemove', this.handleMouseMove, false);
  }

  async stopPicking() {
    await this.waitForInitialization();

    const container = this.container as HTMLElement;

    container.removeEventListener('click', this.handleClick, false);
    container.removeEventListener('mousemove', this.handleMouseMove, false);
    this.wrapperDrawer?.draw(null, null);
  }
}
