import type { TimeSpentResetLayerData } from "@game/resetLayers/types";
import { formatTime } from "@core/format/time";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import Container from "@ui/components/base/Container";
import Paragraph from "@ui/components/base/Paragraph";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function SliphTimeSpent() {
  const state = usePlayerFields(
    {
      cachedPlayer: ["highestResetDuration"],
    },
    {
      selector: (state) =>
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
    <Container>
      <Paragraph>
        Time spent this run: {time}{" "}
        {activeReset && (
          <>
            <span className={activeReset[2]}>({activeReset[1]})</span>
          </>
        )}
      </Paragraph>
    </Container>
  );
}

export default SliphTimeSpent;
