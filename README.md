# scroll-data-hook

The `scroll-data-hook` gives information about user-scrolling like speed, distance, direction and more. Very useful when building navigation menu's that show and hide based on scrolling behaviour.


[![NPM](https://img.shields.io/npm/v/scroll-data-hook.svg)](https://www.npmjs.com/package/scroll-data-hook)

## Demo

Check out the demo [here](https://dejorrit.github.io/scroll-data-hook/).

## Install

```bash
yarn add scroll-data-hook
```

## Usage

```tsx
import * as React from "react";
import { useScrollData } from "scroll-data-hook";

const Example = () => {
  const {
    scrolling,
    time,
    speed,
    direction,
    position,
    relativeDistance,
    totalDistance
  } = useScrollData({
    onScrollStart: () => {},
    onScrollEnd: () => {}
  });
};
```

## License

MIT © [dejorrit](https://github.com/dejorrit)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
