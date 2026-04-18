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

  describe('Escape key + onCancel', () => {
    it('should stop picking when Escape is pressed', async () => {
      const picker = new ElementPicker({ picking: true });
      await new Promise((res) => setTimeout(res, 100));
      expect(picker.isPicking).toBe(true);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((res) => setTimeout(res, 100));
      expect(picker.isPicking).toBe(false);
    });

    it('should call onCancel when Escape is pressed', async () => {
      const onCancel = jest.fn();
      new ElementPicker({ picking: true, onCancel });
      await new Promise((res) => setTimeout(res, 100));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel for other keys', async () => {
      const onCancel = jest.fn();
      new ElementPicker({ picking: true, onCancel });
      await new Promise((res) => setTimeout(res, 100));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should not respond to Escape after stopPicking', async () => {
      const onCancel = jest.fn();
      const picker = new ElementPicker({ picking: true, onCancel });
      await new Promise((res) => setTimeout(res, 100));
      await picker.stopPicking();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('filter option', () => {
    it('should not call onTargetChange for elements where filter returns false', async () => {
      const onTargetChange = jest.fn();
      new ElementPicker({
        picking: true,
        onTargetChange,
        filter: (el) => el.id !== 'target',
      });
      await new Promise((res) => setTimeout(res, 100));
      const target = document.getElementById('target');
      target?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      expect(onTargetChange).not.toHaveBeenCalled();
    });

    it('should call onTargetChange for elements where filter returns true', async () => {
      const onTargetChange = jest.fn();
      new ElementPicker({
        picking: true,
        onTargetChange,
        filter: (el) => el.id === 'target',
      });
      await new Promise((res) => setTimeout(res, 100));
      const target = document.getElementById('target');
      target?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      expect(onTargetChange).toHaveBeenCalled();
    });

    it('should not show overlay for filtered-out elements', async () => {
      new ElementPicker({ picking: true, filter: () => false });
      await new Promise((res) => setTimeout(res, 100));
      const target = document.getElementById('target');
      target?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      const wrappers = document.querySelectorAll<HTMLElement>('body > div');
      const overlayWrapper = Array.from(wrappers).find(
        (el) => el.style.zIndex === '99999'
      );
      expect(overlayWrapper?.style.display).toBe('none');
    });
  });

  describe('isPicking', () => {
    it('should be false initially when picking option is not set', async () => {
      const picker = new ElementPicker({});
      await new Promise((res) => setTimeout(res, 100));
      expect(picker.isPicking).toBe(false);
    });

    it('should be true after startPicking and false after stopPicking', async () => {
      const picker = new ElementPicker({});
      await new Promise((res) => setTimeout(res, 100));
      await picker.startPicking();
      expect(picker.isPicking).toBe(true);
      await picker.stopPicking();
      expect(picker.isPicking).toBe(false);
    });

    it('should be true when picking option is true', async () => {
      const picker = new ElementPicker({ picking: true });
      await new Promise((res) => setTimeout(res, 100));
      expect(picker.isPicking).toBe(true);
    });
  });

  describe('destroy()', () => {
    it('should remove the overlay wrapper from the DOM', async () => {
      const picker = new ElementPicker({ picking: true });
      await new Promise((res) => setTimeout(res, 100));
      await picker.destroy();
      expect(document.querySelector('[style*="z-index: 99999"]')).toBeNull();
    });

    it('should stop responding to mousemove after destroy', async () => {
      const onTargetChange = jest.fn();
      const picker = new ElementPicker({ picking: true, onTargetChange });
      await new Promise((res) => setTimeout(res, 100));
      await picker.destroy();
      const target = document.getElementById('target');
      target?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      expect(onTargetChange).not.toHaveBeenCalled();
    });

    it('should stop responding to clicks after destroy', async () => {
      const onClick = jest.fn();
      const picker = new ElementPicker({ picking: true, onClick });
      await new Promise((res) => setTimeout(res, 100));
      await picker.destroy();
      const target = document.getElementById('target');
      target?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).not.toHaveBeenCalled();
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
