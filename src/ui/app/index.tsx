import gameConfig from "@core/config/data";
import Container from "@ui/components/base/Container";
import Heading from "@ui/components/base/Heading";
import Menu from "@ui/components/game/menu";
import useDimensionScroll from "@ui/hooks/useDimensionScroll";
import useGlobalEvents from "@ui/hooks/useGlobalEvents";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import NormalDimension from "./dimensions/normal";
import SliphDimension from "./dimensions/sliph";

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
      <Container
        asChild
        className="size-full flex-col gap-20 pt-[calc(8vmin+1.5rem)] pb-12"
      >
        <main>
          <NormalDimension />
          <SliphDimension />
        </main>
      </Container>
    </>
  );
}

export default App;
