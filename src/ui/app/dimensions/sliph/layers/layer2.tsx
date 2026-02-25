import DimensionLayerLayout from "@/ui/components/base/DimensionLayerLayout";
import { mergeObjects } from "@core/utils/object";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { hasUpgrades } from "@game/upgrades/utils/has";
import LevelBar from "@ui/components/progressBars/LevelBar";
import AmplivoidUpgrade from "@ui/components/repeatableUpgrades/AmplivoidUpgrade";
import Amplivoid from "@ui/components/states/Amplivoid";
import Score from "@ui/components/states/Score";
import XPState from "@ui/components/states/XP";
import AutoLevelButton from "@ui/components/toggles/AutoLevelButton";
import LevelUpgrades from "@ui/components/upgrades/LevelUpgrades";
import LevelUpgrades2 from "@ui/components/upgrades/LevelUpgrades2";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function SliphDimensionLayer2() {
  const state = usePlayer((state) => {
    const resetLayers = everPerformedResetLayers(state, ["level"]);
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
          {state.level_4 && (
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
