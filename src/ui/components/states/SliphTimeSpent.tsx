import { formatTime } from "@core/format/time";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { TimeSpentResetLayerData } from "@game/resetLayers/types";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";

function SliphTimeSpent() {
  const state = usePlayerFields(
    {
      cachedPlayer: ["highestResetDuration"],
    },
    {
      additionalSelectors: (state) =>
        everPerformedResetLayers(state, ["level", "xagyros"]),
    },
  );

  const activeReset = (
    [
      [state.resetLayer_xagyros_everPerformed, "X", "text-xagyros"],
      [state.resetLayer_level_everPerformed, "L", "text-level"],
    ] as TimeSpentResetLayerData
  ).find(([date]) => date);

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

export default SliphTimeSpent;
