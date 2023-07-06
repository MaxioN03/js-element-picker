
# js-element-picker

JavaScript/TypeScript library for selecting elements on a web page.

## Installation

Install with `npm`:
```bash
npm install js-element-picker
```

Or `yarn`:
```bash
yarn add js-element-picker
```

## Simple example

```javascript
import { ElementPicker } from 'js-element-picker';

new ElementPicker({
  picking: true,
  onClick: (targets) => alert(`Picked element: ${target.tagName}`),
});
```

## Constructor arguments

| Name        | Type        | Default | Description
|-------------|-------------|---------|-------------|
| `picking`   | `boolean`   |         |if `true`, starts picking immediately after initialization|
| `container`   | `Element`   | `document`        |if `container` was passed, picking will be inside of this container|
| `overlayDrawer`   | `Function`   | Default overlay        |[See description below](#wrapperDrawer-type). If `overlayDrawer` was passed, i will be drawn instead of default overlay on the hovering element|
| `onTargetChange`   | `onTargetChange?: (target?: Element, event?: MouseEvent) => void;`   |         |callback that will fire every time when hovering target was changed|
| `onClick`   | `(target: Element) => void;`   |         |callback that fires when user clicks on the picked element|

### wrapperDrawer type:
```javascript
overlayDrawer?: (
    position?: { x: number; y: number; width: number; height: number } | null,
    event?: MouseEvent | null
  ) => void;
```

## Methods:

 - `startPicking()` - start picking elements
 - `stopPicking()` - stop picking elements
