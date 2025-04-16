import { ElementPicker } from '../src/ElementPicker';

describe('ElementPicker', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';

    container = document.createElement('div');
    container.id = 'target';
    container.style.width = '100px';
    container.style.height = '100px';
    container.textContent = 'Hover me';
    document.body.appendChild(container);
  });

  describe('Constructor arguments', () => {
    describe('picking', () => {
      it("shouldn't call onTargetChange on mousemove if picking argument is false", async () => {
        const onTargetChange = jest.fn();
        const picker = new ElementPicker({
          picking: false,
          onTargetChange,
        });
        await new Promise((res) => setTimeout(res, 100));
        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);
        expect(onTargetChange).not.toHaveBeenCalled();
      });

      it('should call onTargetChange on mousemove if picking argument is false', async () => {
        const onTargetChange = jest.fn();
        const picker = new ElementPicker({
          picking: true,
          onTargetChange,
        });
        await new Promise((res) => setTimeout(res, 100));
        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);
        expect(onTargetChange).toHaveBeenCalled();
      });
    });

    describe('container', () => {
      it('should call onTargetChange on mousemove on any target if container argument is not passed', async () => {
        const onTargetChange = jest.fn();
        const picker = new ElementPicker({
          picking: true,
          container,
          onTargetChange,
        });
        await new Promise((res) => setTimeout(res, 100));
        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);
        expect(onTargetChange).toHaveBeenCalled();
      });

      it('should call onTargetChange on mousemove on a specific target if container argument is passed', async () => {
        const onTargetChange = jest.fn();
        let pickingContainer: HTMLElement;
        pickingContainer = document.createElement('div');
        pickingContainer.innerHTML =
          '<div id="targetForPicking">Hover me</div>';
        document.body.appendChild(pickingContainer);
        const picker = new ElementPicker({
          picking: true,
          container: pickingContainer,
          onTargetChange,
        });
        await new Promise((res) => setTimeout(res, 100));
        const notSpecifiedTarget = document.getElementById('target');
        const mousemoveOnNotSpecifiedTarget = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        notSpecifiedTarget?.dispatchEvent(mousemoveOnNotSpecifiedTarget);
        expect(onTargetChange).not.toHaveBeenCalled();
        const specifiedTarget = document.getElementById('targetForPicking');
        const mousemoveOnSpecifiedTarget = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        specifiedTarget?.dispatchEvent(mousemoveOnSpecifiedTarget);
        expect(onTargetChange).toHaveBeenCalled();
      });
    });

    describe('overlayDrawer', () => {
      it('should use the default overlayDrawer if none is provided', async () => {
        const picker = new ElementPicker({
          picking: true,
          container,
        });

        await new Promise((r) => setTimeout(r, 100));

        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);

        const defaultOverlay = document.querySelector(
          '[data-testid="default-overlay"]'
        );

        expect(defaultOverlay).toBeTruthy();
      });

      it('should use the custom overlayDrawer when provided', async () => {
        const customOverlayDrawer = jest.fn(() => {
          const el = document.createElement('div');
          el.id = 'custom-overlay';
          return el;
        });

        new ElementPicker({
          picking: true,
          container,
          overlayDrawer: customOverlayDrawer,
        });

        await new Promise((r) => setTimeout(r, 100));

        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);

        expect(customOverlayDrawer).toHaveBeenCalled();
        expect(document.querySelector('#custom-overlay')).toBeTruthy();
      });

      it('custom overlayDrawer receives correct position and event', async () => {
        const mockDrawer = jest.fn(() => document.createElement('div'));

        new ElementPicker({
          container,
          picking: true,
          overlayDrawer: mockDrawer,
        });

        await new Promise((r) => setTimeout(r, 100));

        await new Promise((r) => setTimeout(r, 100));

        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);

        expect(mockDrawer).toHaveBeenCalledWith(
          expect.objectContaining({ width: expect.any(Number) }),
          mousemove
        );
      });
    });

    describe('onTargetChange', () => {
      it('should call onTargetChange on hover', async () => {
        const onTargetChange = jest.fn();
        new ElementPicker({
          picking: true,
          container,
          onTargetChange,
        });
        await new Promise((r) => setTimeout(r, 100));
        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);
        expect(onTargetChange).toHaveBeenCalledWith(
          expect.any(Element),
          expect.any(MouseEvent)
        );
      });

      it('should not call onTargetChange if hovering over same element', async () => {
        const onTargetChange = jest.fn();
        new ElementPicker({
          container,
          picking: true,
          onTargetChange,
        });
        await new Promise((r) => setTimeout(r, 100));
        const target = document.getElementById('target');
        const mousemove = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(mousemove);
        target?.dispatchEvent(mousemove); // same target again
        expect(onTargetChange).toHaveBeenCalledTimes(1); // only called once
      });

      it('should not call onTargetChange for <body> or <html>', async () => {
        const onTargetChange = jest.fn();
        new ElementPicker({
          picking: true,
          onTargetChange,
        });
        await new Promise((r) => setTimeout(r, 100));
        const bodyEvent = new MouseEvent('mousemove', { bubbles: true });
        document.body.dispatchEvent(bodyEvent);
        const htmlEvent = new MouseEvent('mousemove', { bubbles: true });
        document.documentElement.dispatchEvent(htmlEvent);
        expect(onTargetChange).not.toHaveBeenCalled();
      });
    });

    describe('onClick', () => {
      it('should call onClick on click', async () => {
        const onClick = jest.fn();

        new ElementPicker({
          container,
          picking: true,
          onClick,
        });

        await new Promise((r) => setTimeout(r, 100));

        const target = document.getElementById('target');
        const click = new MouseEvent('click', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(click);

        expect(onClick).toHaveBeenCalledWith(
          expect.any(Element),
          expect.any(MouseEvent)
        );
      });

      it('should not call onClick if startPicking was not called', async () => {
        const onClick = jest.fn();

        const picker = new ElementPicker({
          picking: false,
          container,
          onClick,
        });

        await new Promise((r) => setTimeout(r, 100));

        const target = document.getElementById('target');
        const clickBefore = new MouseEvent('click', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(clickBefore);

        expect(onClick).not.toHaveBeenCalled();

        await picker.startPicking();

        const clickAfter = new MouseEvent('click', {
          bubbles: true,
          clientX: 10,
          clientY: 10,
        });
        target?.dispatchEvent(clickAfter);

        expect(onClick).toHaveBeenCalled();
      });
    });
  });

  it('should call onTargetChange on mousemove if picking argument is false but startPicking method is fired', async () => {
    const onTargetChange = jest.fn();
    const picker = new ElementPicker({
      picking: false,
      onTargetChange,
    });

    await new Promise((res) => setTimeout(res, 100));

    const target = document.getElementById('target');

    const mousemove = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    });
    target?.dispatchEvent(mousemove);

    await picker.startPicking();

    target?.dispatchEvent(mousemove);

    expect(onTargetChange).toHaveBeenCalledTimes(1);
  });

  it("shouldn't call onTargetChange on mousemove if picking argument is false but stopPicking method is fired", async () => {
    const onTargetChange = jest.fn();
    const picker = new ElementPicker({
      picking: true,
      onTargetChange,
    });

    await new Promise((res) => setTimeout(res, 100));

    const target = document.getElementById('target');

    const mousemove = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    });
    target?.dispatchEvent(mousemove);

    await picker.stopPicking();

    target?.dispatchEvent(mousemove);

    expect(onTargetChange).toHaveBeenCalledTimes(1);
  });
});
