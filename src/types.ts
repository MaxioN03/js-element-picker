export interface PickerWrapper {
  wrapper: HTMLElement | null;
  initialize?: () => void;
  show: (
    {
      x,
      y,
      width,
      height,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    target: any
  ) => void;
  hide: () => void;
}
