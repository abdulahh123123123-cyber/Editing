import { Composition } from "remotion";
import { Showreel } from "./reel/Showreel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Showreel"
      component={Showreel}
      durationInFrames={15 * 60}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};
