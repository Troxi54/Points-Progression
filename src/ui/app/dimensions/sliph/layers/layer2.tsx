import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import DimensionLayerLayout from "@ui/components/base/DimensionLayerLayout";
import AmplivoidUpgrade from "@ui/components/game/repeatableUpgrades/AmplivoidUpgrade";
import LevelBar from "@ui/components/game/resetLayers/LevelBar";
import Amplivoid from "@ui/components/game/states/Amplivoid";
import Score from "@ui/components/game/states/Score";
import XPState from "@ui/components/game/states/XP";
import AutoLevelButton from "@ui/components/game/toggles/AutoLevelButton";
import LevelUpgrades from "@ui/components/game/upgrades/LevelUpgrades";
import LevelUpgrades2 from "@ui/components/game/upgrades/LevelUpgrades2";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function SliphDimensionLayer2() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, ["level", "xagyros"]);
    const upgrades = hasUpgrades(state, {
      mallirt: [4],
      level: [4],
    } as const);

    return mergeObjects(resetLayers, upgrades);
  });

  if (!(state.mallirt_4 || state.resetLayer_level_everPerformed)) return null;

  return (
    <DimensionLayerLayout>
      <LevelBar />
      {state.resetLayer_level_everPerformed && (
        <>
          <AutoLevelButton />
          <Score />
          <XPState />
          <LevelUpgrades />
          {(state.level_4 || state.resetLayer_xagyros_everPerformed) && (
            <>
              <Amplivoid />
              <AmplivoidUpgrade />
              <LevelUpgrades2 />
            </>
          )}
        </>
      )}
    </DimensionLayerLayout>
  );
}

export default SliphDimensionLayer2;
