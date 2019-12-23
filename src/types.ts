export type DirectionType = {
  x: string | null;
  y: string | null;
};

export type XYType = {
  x: number;
  y: number;
};

export type ScrollDataType = {
  scrolling: boolean;
  time: number;
  direction: DirectionType;
  speed: XYType;
  totalDistance: XYType;
  relativeDistance: XYType;
  position: XYType;
};

export type OptionsType = {
  onScrollStart?: Function;
  onScrollEnd?: Function;
};
