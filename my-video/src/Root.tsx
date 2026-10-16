import { Composition } from "remotion";
import { Portfolio } from "./abdullah/Portfolio";
import { Showreel } from "./reel/Showreel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="AbdullahPortfolio" component={Portfolio} durationInFrames={17 * 60} fps={60} width={1920} height={1080} />
      <Composition id="Showreel" component={Showreel} durationInFrames={15 * 60} fps={60} width={1920} height={1080} />
    </>
  );
};
