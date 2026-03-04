import { AnimatedBarOptions } from "./types";

const progressBarConfig = {
  labelSeparator: <>&emsp;|&emsp;</>,
  defaultAnimatedBarOptions: {
    gradientStep: "200px",
    gradientAngle: "90deg",
    animationDuration: "2s",
  } as AnimatedBarOptions,
};

export default progressBarConfig;
