import { formatNumber } from "@/core/format/number";
import { formatBestRunTime } from "@/core/format/time";
import ResetLayerProgressBar from "@/ui/components/base/ResetLayerProgressBar";
import resetLayerConfig from "@/game/resetLayers/config";
import { formatEffectOnCurrency } from "@/core/format/effect";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

function ResetBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="reset"
      progressFillClassName="bg-reset"
      labelParts={({ player, cachedPlayer }) => {
        const { bestRun, bestPointsOfRun } = player;

        if (bestRun === null && bestPointsOfRun.equals(0)) return;

        return [
          <>
            Best run: {formatBestRunTime(bestRun)}{" "}
            {bestRun &&
              bestRun.lessThanOrEqualTo(
                resetLayerConfig.firstResetLayerBestRunLimit,
              ) &&
              "(limit)"}
            {" - "}
            <span className="text-reset-effect">
              Effect: {formatEffectOnCurrency(cachedPlayer.runEffect, "points")}
              {hasNexusLevel(player, 2) && (
                <>
                  ,{" "}
                  {formatEffectOnCurrency(
                    cachedPlayer.runDertointEffect,
                    "dertoints",
                  )}{" "}
                  <span className="text-(--nexus-milestone-2)">(N2)</span>
                </>
              )}
            </span>
          </>,
          <>
            Best Points: {formatNumber(player.bestPointsOfRun)} -{" "}
            <span className="text-reset-effect">
              Effect:{" "}
              {formatEffectOnCurrency(
                cachedPlayer.bestPointsOfRunEffect,
                "points",
              )}
              {hasNexusLevel(player, 3) && (
                <>
                  ,{" "}
                  {formatEffectOnCurrency(
                    cachedPlayer.bestPointsOfRunVermoraEffect,
                    "vermora",
                  )}{" "}
                  <span className="text-(--nexus-milestone-3)">(N3)</span>
                </>
              )}
            </span>
          </>,
        ];
      }}
    />
  );
}

export default ResetBar;
