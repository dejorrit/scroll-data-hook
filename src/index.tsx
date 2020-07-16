import * as React from "react";
import { ScrollDataType, OptionsType } from "./types";

const SCROLL_END_DURATION = 100;

const INITIAL_DATA = {
  scrolling: false,
  time: 0,
  direction: {
    x: null,
    y: null
  },
  speed: {
    x: 0,
    y: 0
  },
  totalDistance: {
    x: 0,
    y: 0
  },
  relativeDistance: {
    x: 0,
    y: 0
  },
  position: {
    x: 0,
    y: 0
  }
};

function getPositionX() {
  return window.pageXOffset || 0;
}

function getPositionY() {
  return window.pageYOffset || 0;
}

function getDirectionX(x: number, frameValues: ScrollDataType): string | null {
  if (x > frameValues.position.x) return "right";
  if (x < frameValues.position.x) return "left";
  return null;
}

function getDirectionY(y: number, frameValues: ScrollDataType): string | null {
  if (y > frameValues.position.y) return "down";
  if (y < frameValues.position.y) return "up";
  return null;
}

function getTotalDistanceX(x: number, frameValues: ScrollDataType): number {
  return frameValues.totalDistance.x + Math.abs(x - frameValues.position.x);
}

function getTotalDistanceY(y: number, frameValues: ScrollDataType): number {
  return frameValues.totalDistance.y + Math.abs(y - frameValues.position.y);
}

function getRelativeDistanceX(x: number, startValues: ScrollDataType): number {
  return Math.abs(x - startValues.position.x);
}

function getRelativeDistanceY(y: number, startValues: ScrollDataType): number {
  return Math.abs(y - startValues.position.y);
}

export const useScrollData = (options: OptionsType = {}): ScrollDataType => {
  const [data, setData] = React.useState<ScrollDataType>(INITIAL_DATA);
  const startValues = React.useRef<ScrollDataType>(INITIAL_DATA);
  const frameValues = React.useRef<ScrollDataType>(INITIAL_DATA);
  const startTimestamp = React.useRef<number | null>();
  const frameTimestamp = React.useRef<number | null>();
  const scrollTimeout = React.useRef<any>(null);
  const raf = React.useRef<any>(null);

  function frame(timestamp: number) {
    if (!startTimestamp.current) startTimestamp.current = timestamp;

    // Calculate the time in ms that scrolling is active
    const time = timestamp - startTimestamp.current;

    // Set new position values
    const position = {
      x: getPositionX(),
      y: getPositionY()
    };

    // Set new direction values
    const direction = {
      x: getDirectionX(position.x, frameValues.current),
      y: getDirectionY(position.y, frameValues.current)
    };

    // Set new totalDistance values
    const totalDistance = {
      x: getTotalDistanceX(position.x, frameValues.current),
      y: getTotalDistanceY(position.y, frameValues.current)
    };

    // Set new relativeDistance values
    const relativeDistance = {
      x: getRelativeDistanceX(position.x, startValues.current),
      y: getRelativeDistanceY(position.y, startValues.current)
    };

    // Set new speed values
    const timestampDiff = timestamp - (frameTimestamp.current || 0);
    const speed = {
      x:
        (Math.abs(frameValues.current.position.x - position.x) /
          Math.max(1, timestampDiff)) *
        1000,
      y:
        (Math.abs(frameValues.current.position.y - position.y) /
          Math.max(1, timestampDiff)) *
        1000
    };

    const nextframeValues = {
      ...frameValues.current,
      scrolling: true,
      time,
      direction,
      speed,
      totalDistance,
      relativeDistance,
      position
    };

    // Store new values
    frameValues.current = nextframeValues;

    // Update the state
    setData(nextframeValues);

    // Set frameTimestamp for speed calculation
    frameTimestamp.current = timestamp;

    // We're still scrolling, so call tick method again
    raf.current = requestAnimationFrame(frame);
  }

  function clearAndSetscrollTimeout() {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(scrollEnd, SCROLL_END_DURATION);
  }

  function onScroll() {
    if (!frameValues.current.scrolling) {
      scrollStart();
    }

    clearAndSetscrollTimeout();
  }

  function scrollStart() {
    // Save data at the moment of starting so we have
    // something to compare the current values against
    startValues.current = { ...frameValues.current };

    // Start RAF
    raf.current = requestAnimationFrame(frame);

    // If present, call onScrollStart function
    if (typeof options.onScrollStart === "function") {
      options.onScrollStart();
    }
  }

  function scrollEnd() {
    // Reset scroll data
    frameValues.current = {
      ...frameValues.current,
      scrolling: false,
      time: 0,
      direction: {
        x: null,
        y: null
      },
      speed: {
        x: 0,
        y: 0
      },
      totalDistance: {
        x: 0,
        y: 0
      },
      relativeDistance: {
        x: 0,
        y: 0
      }
    };

    // Update the state
    setData(frameValues.current);

    // Cancel RAF
    cancelAnimationFrame(raf.current);
    startTimestamp.current = null;
    frameTimestamp.current = null;

    // If present, call onScrollEnd function
    if (typeof options.onScrollEnd === "function") {
      options.onScrollEnd();
    }
  }

  React.useEffect(() => {
    // Add scrollListener
    window.addEventListener("scroll", onScroll, true);

    // Remove listener when unmounting
    return () => {
      clearTimeout(scrollTimeout.current);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  // Return data with rounded values
  return {
    ...data,
    time: Math.round(data.time),
    speed: {
      x: Math.round(data.speed.x),
      y: Math.round(data.speed.y)
    },
    totalDistance: {
      x: Math.round(data.totalDistance.x),
      y: Math.round(data.totalDistance.y)
    },
    relativeDistance: {
      x: Math.round(data.relativeDistance.x),
      y: Math.round(data.relativeDistance.y)
    },
    position: {
      x: Math.round(data.position.x),
      y: Math.round(data.position.y)
    }
  };
};
