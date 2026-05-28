import type { TimeSpentResetLayerData } from "@game/resetLayers/types";
import { formatTime } from "@core/format/time";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Paragraph from "@ui/components/base/Paragraph";

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

export default SliphTimeSpent;
