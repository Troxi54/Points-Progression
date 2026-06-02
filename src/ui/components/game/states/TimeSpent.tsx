import type { TimeSpentResetLayerData } from "@game/resetLayers/types";
import { formatTime } from "@core/format/time";
import { everPerformedResetLayers } from "@game/resetLayers/utils/selector";
import Container from "@ui/components/base/Container";
import Paragraph from "@ui/components/base/Paragraph";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

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

export default TimeSpent;
