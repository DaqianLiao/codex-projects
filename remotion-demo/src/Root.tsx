import { Composition } from "remotion";
import { Demo } from "./Demo";
import { MultiplicationLaws } from "./MultiplicationLaws";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo"
        component={Demo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MultiplicationLaws"
        component={MultiplicationLaws}
        durationInFrames={555}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
