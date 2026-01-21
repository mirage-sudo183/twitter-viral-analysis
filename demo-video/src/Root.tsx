import { Composition } from "remotion";
import { Demo } from "./Demo";

export const RemotionRoot = () => {
  // Duration: 3s intro + 10s * 3 scenarios + 5s outro = 38 seconds
  const fps = 30;
  const durationInFrames = fps * 38;

  return (
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={durationInFrames}
      fps={fps}
      width={1920}
      height={1080}
    />
  );
};
