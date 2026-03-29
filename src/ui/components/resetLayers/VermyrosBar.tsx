import { formatNumber } from "@core/format/number";
import ResetLayerProgressBar from "@ui/components/base/ProgressBar/ResetLayer";
import { formatEffectOnCurrency } from "@core/format/effect";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import NexusSign from "../base/NexusSign";

function VermyrosBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="vermyros"
      mode="animated"
      progressFillClassName="from-vermyros-1 via-vermyros-2 to-vermyros-1"
      labelParts={({ player, cachedPlayer }) => {
        return [
          <>
            Best Vermytes on reset: {formatNumber(player.bestVermytes)} -{" "}
            <span className="text-vermyros-effect">
              Effect:{" "}
              {formatEffectOnCurrency(
                cachedPlayer.bestVermytesEffect,
                "vermora",
              )}
              {hasNexusLevel(player, 7) && (
                <>
                  ,{" "}
                  {formatEffectOnCurrency(
                    cachedPlayer.bestVermytesPointsEffect,
                    "points",
                  )}{" "}
                  <NexusSign level={7} />
                </>
              )}
            </span>
          </>,
        ];
      }}
    />
  );
}

export default VermyrosBar;
