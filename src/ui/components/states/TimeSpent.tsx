import { formatTime } from "@/core/format/time";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { TimeSpentResetLayerData } from "@/game/resetLayers/types";
import { everPerformedResetLayers } from "@/game/resetLayers/utils/selector";

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
      <p>
        Time spent this run: {time}{" "}
        {activeReset && (
          <>
            <span className={activeReset[2]}>({activeReset[1]})</span>
          </>
        )}
      </p>
    </div>
  );
}

export default TimeSpent;
