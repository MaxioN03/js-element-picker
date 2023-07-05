import { DefaultWrapper } from './DefaultWrapper';

interface ElementPickerProps {
  picking?: boolean;
  container?: Element;
  wrapperDrawer?: (
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    target: Element | null
  ) => void;
  onTargetChange?: (target: Element) => void;
  onClick?: (target: Element) => void;
}

export class ElementPicker {
  private initialized: boolean = false;
  private previousTarget: Element | null = null;
  container: Element | Document | null = null;
  wrapperDrawer: ElementPickerProps['wrapperDrawer'] | null = null;
  onTargetChange: ((target: Element) => void) | null = null;
  onClick: ((target: Element) => void) | null = null;

  constructor(props: ElementPickerProps) {
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        this.initialize.bind(this, props)
      );
    } else {
      this.initialize(props);
    }
  }

  private initialize({
    picking,
    container,
    wrapperDrawer,
    onTargetChange,
    onClick,
  }: ElementPickerProps) {
    this.container = container ?? document;
    if (wrapperDrawer) {
      this.wrapperDrawer = wrapperDrawer;
    } else {
      const defaultWrapper = new DefaultWrapper();
      this.wrapperDrawer = defaultWrapper.draw.bind(defaultWrapper);
    }
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
        console.log(this.wrapperDrawer);
        this.wrapperDrawer?.({ x, y, width, height }, target);
        this.onTargetChange?.(target);
      } else {
        this.wrapperDrawer?.(null, null);
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

    const container = this.container as HTMLElement;

    container.addEventListener('click', this.handleClick);
    container.addEventListener('mousemove', this.handleMouseMove, false);
  }

  async stopPicking() {
    await this.waitForInitialization();

    const container = this.container as HTMLElement;

    container.removeEventListener('click', this.handleClick, false);
    container.removeEventListener('mousemove', this.handleMouseMove, false);
    this.wrapperDrawer?.(null, null);
  }
}
