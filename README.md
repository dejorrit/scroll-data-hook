# Scroll Data Hook

[![NPM](https://img.shields.io/npm/v/scroll-data-hook.svg)](https://www.npmjs.com/package/scroll-data-hook)

The `useScrollData` hook returns information about scroll speed, distance, direction and more. Useful when building dynamic navigation bars or doing other scroll related UI updates.

Check out [the demo](https://dejorrit.github.io/scroll-data-hook/).

## Installation

```bash
yarn add scroll-data-hook
```

## Usage

```tsx
import * as React from "react";
import { useScrollData } from "scroll-data-hook";

const MyComponent = () => {
  const {
    scrolling,
    time,
    speed,
    direction,
    position,
    relativeDistance,
    totalDistance
  } = useScrollData({
    onScrollStart: () => {
      console.log('Started scrolling);
    },
    onScrollEnd: () => {
      console.log('Finished scrolling);
    }
  });

  return (
    <div>
      <p>
        {scrolling ? 'Scrolling' : 'Not scrolling'}
      </p>

      <p>
        Scrolling time: {time} milliseconds
      </p>

      <p>
        Horizontal speed: {speed.x} pixels per second
      </p>

      <p>
        Vertical speed: {speed.y} pixels per second
      </p>

      <p>
        Direction: {direction.x} {direction.y}
      </p>

      <p>
        Relative distance: {relativeDistance.x}/{relativeDistance.y}
      </p>

      <p>
        Total distance: {totalDistance.x}/{totalDistance.y}
      </p>
    </div>
  )
};
```

## License

MIT © [dejorrit](https://github.com/dejorrit)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
