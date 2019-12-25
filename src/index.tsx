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

const isBrowser = typeof window !== "undefined";

function getPositionX() {
  return window.pageXOffset || 0;
}

function getPositionY() {
  return window.pageYOffset || 0;
}

function getDirectionX(x: number, frameData: ScrollDataType): string | null {
  if (x > frameData.position.x) return "right";
  if (x < frameData.position.x) return "left";
  return null;
}

function getDirectionY(y: number, frameData: ScrollDataType): string | null {
  if (y > frameData.position.y) return "down";
  if (y < frameData.position.y) return "up";
  return null;
}

function getTotalDistanceX(x: number, frameData: ScrollDataType): number {
  return frameData.totalDistance.x + Math.abs(x - frameData.position.x);
}

function getTotalDistanceY(y: number, frameData: ScrollDataType): number {
  return frameData.totalDistance.y + Math.abs(y - frameData.position.y);
}

function getRelativeDistanceX(x: number, startData: ScrollDataType): number {
  return Math.abs(x - startData.position.x);
}

function getRelativeDistanceY(y: number, startData: ScrollDataType): number {
  return Math.abs(y - startData.position.y);
}

export const useScrollData = (options: OptionsType = {}): ScrollDataType => {
  const [data, setData] = React.useState<ScrollDataType>(INITIAL_DATA);
  const startData = React.useRef<ScrollDataType>(INITIAL_DATA);
  const frameData = React.useRef<ScrollDataType>(INITIAL_DATA);
  const startDate = React.useRef<Date>(new Date());
  const sEndTimer = React.useRef<any>(null);

  function clearAndSetsEndTimer() {
    if (sEndTimer.current) clearTimeout(sEndTimer.current);
    sEndTimer.current = setTimeout(scrollEnd, SCROLL_END_DURATION);
  }

  function onScroll() {
    clearAndSetsEndTimer();

    if (!frameData.current.scrolling) {
      scrollStart();
    }

    // Calculate the time in ms that scrolling is active
    const time = Number(new Date()) - Number(startDate.current);

    // Set new position values
    const position = {
      x: getPositionX(),
      y: getPositionY()
    };

    // Set new direction values
    const direction = {
      x: getDirectionX(position.x, frameData.current),
      y: getDirectionY(position.y, frameData.current)
    };

    // Set new totalDistance values
    const totalDistance = {
      x: getTotalDistanceX(position.x, frameData.current),
      y: getTotalDistanceY(position.y, frameData.current)
    };

    // Set new relativeDistance values
    const relativeDistance = {
      x: getRelativeDistanceX(position.x, startData.current),
      y: getRelativeDistanceY(position.y, startData.current)
    };

    // Set new speed values
    const speed = {
      x: Math.round(totalDistance.x / (Math.max(1, time) / 1000)),
      y: Math.round(totalDistance.y / (Math.max(1, time) / 1000))
    };

    const nextFrameData = {
      ...frameData.current,
      scrolling: true,
      time: Math.round(time) || 0,
      direction,
      speed,
      totalDistance,
      relativeDistance,
      position
    };

    // Store new values
    frameData.current = nextFrameData;

    // Update the state
    setData(nextFrameData);
  }

  function scrollStart() {
    // Save data at the moment of starting so we have
    // something to compare the current values against
    startData.current = { ...frameData.current };
    startDate.current = new Date();

    // If present, call onScrollStart function
    if (typeof options.onScrollStart === "function") {
      options.onScrollStart();
    }
  }

  function scrollEnd() {
    // Reset scroll data
    frameData.current = {
      ...frameData.current,
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
    setData(frameData.current);

    // If present, call onScrollEnd function
    if (typeof options.onScrollEnd === "function") {
      options.onScrollEnd();
    }
  }

  React.useEffect(() => {
    // Stop when we're not in a browser environment
    if (!isBrowser) return;

    // Add scrollListener
    window.addEventListener("scroll", onScroll, true);

    // Remove listener when unmounting
    return () => {
      clearTimeout(sEndTimer.current);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return data;
};
