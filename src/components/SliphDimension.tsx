import { usePlayer } from "@player/playerStore";
import AutoMallirtButton from "./AutoMallirtButton";
import Dertoints from "./Dertoints";
import DertointUpgrade from "./DertointUpgrade";
import DertointUpgrades from "./DertointUpgrades";
import MallirtBar from "./MallirtBar";
import MallirtUpgrades from "./MallirtUpgrades";
import SliphTimeSpent from "./SliphTimeSpent";

function SliphDimension() {
  const state = usePlayer((state) => ({
    everMadeMallirt: state.player.everMadeMallirt
  }));

  return (
    <div className="layer">
      <SliphTimeSpent />
      <Dertoints />
      <DertointUpgrade />
      <DertointUpgrades />
      <MallirtBar />
      {state.everMadeMallirt && (
        <>
          <AutoMallirtButton />
          <MallirtUpgrades />
        </>
      )}
    </div>
  );
}

export default SliphDimension;
