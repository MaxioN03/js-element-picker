
# js-element-picker

JavaScript/TypeScript library for selecting elements on a web page.

<p align="center">
  <img src="https://i.imgur.com/mGlNnAo.gif">
</p>


## Installation

Install with `npm`:
```bash
npm install js-element-picker
```

Or `yarn`:
```bash
yarn add js-element-picker
```

## React wrapper

For this library there is a **React** wrapper `react-js-element-picker`, which you can [see here](https://www.npmjs.com/package/react-js-element-picker)

## Simple example

```javascript
import { ElementPicker } from 'js-element-picker';

new ElementPicker({
  picking: true,
  onClick: (target) => alert(`Picked element: ${target.tagName}`),
});
```

## Constructor arguments

| Name        | Type        | Default | Description
|-------------|-------------|---------|-------------|
| `picking`   | `boolean`   |         |if `true`, starts picking immediately after initialization|
| `container`   | `Element`   | `document`        |if `container` was passed, picking will be inside of this container|
| `overlayDrawer`   | `Function`   | Default overlay        |[See type below](#overlaydrawer-type). If `overlayDrawer` was passed, it will be drawn instead of default overlay on the hovering element|
| `onTargetChange`   | `(target?: Element, event?: MouseEvent) => void;`   |         |callback that will fire every time when hovering target was changed|
| `onClick`   | `(target: Element, event?: MouseEvent) => void;`   |         |callback that fires when user clicks on the picked element|

### overlayDrawer type:
```javascript
overlayDrawer?: (
    position?: { x: number; y: number; width: number; height: number } | null,
    event?: MouseEvent | null
  ) => Element;
```

## Methods:

 - `startPicking()` - start picking elements
 - `stopPicking()` - stop picking elements

## Examples

<details>
  <summary>Basic example</summary>

  In this example you create `ElementPicker` object which starts picking immediately after initialization and after click on target logs it in console and stops picking

  ```javascript
  import { ElementPicker } from 'js-element-picker';

  const elementPicker = new ElementPicker({
    picking: true,
    onClick: (target) => {
      console.log(`Picked element: ${target?.tagName}`);
      elementPicker.stopPicking();
    },
  });
  ```
</details>

<details>
  <summary>Picking inside custom container</summary>

  By default `ElementPicker` picks inside the document. If you want to pick elements inside custom container, you need to pass it as `container` argument

  <i>Please note that if you DOM is not initialized and your `customContainer` is null, it couldn't work in a right way. So be sure that your container exists</i>

  So first
  ```javascript
  import { ElementPicker } from 'js-element-picker';

  const customContainer = document.getElementById('my-custom-container');

  const elementPicker = new ElementPicker({
    picking: true,
    container: customContainer,
    onClick: (target) => {
      console.log(`Picked element: ${target?.tagName}`);
      elementPicker.stopPicking();
    },
  });
  ```
</details>


<details>
  <summary>Start picking after custom event</summary>

  If you want to start picking on any event (for example, button click), you can use `startPicking()` method

  ```javascript
  import { ElementPicker } from 'js-element-picker';

  const button = document.getElementById('start-pick');

  const elementPicker = new ElementPicker({
    onClick: (target) => {
      console.log(`Picked element: ${target}`);
      elementPicker.stopPicking();
    },
  });

  button?.addEventListener('click', () => elementPicker.startPicking());
  ```
</details>

<details>
  <summary>Custom overlay for hovering element</summary>

  If you want to create custom overlay for hovering element, you need to pass `overlayDrawer()` function. It gets `position` and `event` as arguments and must return an Element. Result element will appear inside of overlay, so you don't need to think about positioning. Actually `position` is some fields from `event` just to make it easier to get.

  So first you need to create a function for overlay drawer:
  

  ```javascript
  const myCustomOverlayDrawer = (
    position: { x: number; y: number; width: number; height: number } | null,
    event: MouseEvent | null
  ) => {
    const overlay = document.createElement('div');

    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(255, 0, 166, 0.8)';
    overlay.style.display = 'flex';

    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.gap = '8px';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'monospace';

    const tagNameSpan = document.createElement('span');
    const target = event?.target as Element;
    tagNameSpan.append(target?.tagName);
    overlay.append(tagNameSpan);

    if (position) {
      const positionSpan = document.createElement('span');
      positionSpan.append(`{x: ${position.x}, y: ${position.y}}`);
      overlay.append(positionSpan);
    }

    return overlay;
  };
  ```

  And then you can use it:

  ```javascript
  import { ElementPicker } from 'js-element-picker';

  const elementPicker = new ElementPicker({
    picking: true,
    onClick: (target) => {
      console.log(`Picked element: ${target}`);
      elementPicker.stopPicking();
    },
    overlayDrawer: myCustomOverlayDrawer,
  });
  ```

  As a result you'll see something like this:
  <p align="center">
  <img src="https://i.imgur.com/Q8bwEU7.gif">
  </p>
</details>


<details>
  <summary>Make something when target is changed</summary>

  If you want to make something while user is picking elements, you can use `onTargetChange` argument. That is function which will fire every time when target was updated

  ```javascript
  import { ElementPicker } from 'js-element-picker';

  new ElementPicker({
    picking: true,
    onTargetChange: (target) => console.log(`Hovering element: ${target?.tagName}`),
  });
  ``` 
</details>