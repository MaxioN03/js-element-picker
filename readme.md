
# js-element-picker

JavaScript library for selecting elements on a web page with a mouse

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
  onClick: (target: any) => alert(`Picked element: ${target.tagName}`),
});
```

## Constructor arguments

 - `picking?: boolean;` - if true, starts picking immediately after initialization. By default `false`

 - `container?: Element;` - if `container` was passed, picking will be runs inside of this container. By default `document`
 - `wrapperDrawer` - a function to draw a wrapper of picking element. if `wrapperDrawer` was passed it will be fired every time when target changed. Please note that it not add your container into the document. All manipulation you do by yourself. Arguments of the function: 
 ```javascript
wrapperDrawer?: (
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    target: Element | null
  ) => void;
``` 
 - `onTargetChange?: (target: Element) => void;` - a callback that fires every time when target was changed
 - `onClick?: (target: Element) => void;` - a callback that fires when user clicks on the picked element

## Methods:

 - `startPicking()` - start picking elements
 - `stopPicking()` - stop picking elements
