import Menu from "@ui/components/game/menu";
import useDimensionScroll from "@ui/hooks/useDimensionScroll";
import useGlobalEvents from "@ui/hooks/useGlobalEvents";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import NormalDimension from "./dimensions/normal";
import SliphDimension from "./dimensions/sliph";
import Heading from "@ui/components/base/Heading";
import gameConfig from "@core/config/data";

function App() {
  useGlobalEvents();

  const state = usePlayerFields({
    player: ["dimensionId"],
  });

  useDimensionScroll({ dimensionId: state.dimensionId });

  return (
    <>
      <Heading level={1} className="sr-only">
        {gameConfig.gameName}
      </Heading>
      <Menu />
      <div className="size-full flex-col gap-20 pt-[calc(8vmin+1.5rem)] pb-12">
        <NormalDimension />
        <SliphDimension />
      </div>
    </>
  );
}

export default App;
