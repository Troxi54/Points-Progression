import type { TimeSpentResetLayerData } from "@game/resetLayers/types";
import { formatTime } from "@core/format/time";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Paragraph from "../base/Paragraph";

function TimeSpent() {
  const state = usePlayerFields(
    {
      cachedPlayer: ["highestResetDuration"],
    },
    {
      additionalSelectors: (state) =>
        everPerformedResetLayers(state, ["tier", "vermyros", "nullith"]),
    },
  );

  const activeReset = (
    [
      [state.resetLayer_nullith_everPerformed, "N", "nullith"],
      [state.resetLayer_vermyros_everPerformed, "V", "text-vermyros"],
      [state.resetLayer_tier_everPerformed, "T", "text-tier"],
    ] as TimeSpentResetLayerData
  ).find(([works]) => works);

  const time = formatTime(state.highestResetDuration);

  return (
    <div>
      <Paragraph>
        Time spent this run: {time}{" "}
        {activeReset && (
          <>
            <span className={activeReset[2]}>({activeReset[1]})</span>
          </>
        )}
      </Paragraph>
    </div>
  );
}

export default TimeSpent;
