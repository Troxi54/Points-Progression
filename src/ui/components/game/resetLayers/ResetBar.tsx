import { formatEffectOnCurrency } from "@core/format/effect";
import { formatNumber } from "@core/format/number";
import { formatBestRunTime } from "@core/format/time";
import cn from "@core/utils/tailwind";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { getRepeatableUpgradeLevel } from "@game/repeatableUpgrades/utils/get";
import resetResetLayerConfig from "@game/resetLayers/data/layers/reset/config";
import NexusSign from "@ui/components/features/NexusSign";
import ResetLayerProgressBar from "@ui/components/features/ResetLayer";

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
            Best run: {formatBestRunTime(bestRun, { scientificPrecision: 0 })}{" "}
            {bestRun &&
              bestRun.lessThanOrEqualTo(resetResetLayerConfig.bestRunLimit) && (
                <span
                  className={cn(
                    getRepeatableUpgradeLevel(player, "beneflux").greaterThan(
                      0,
                    ) && "text-beneflux",
                  )}
                >
                  (limit)
                </span>
              )}
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
                  <NexusSign level={2} />
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
                  <NexusSign level={3} />
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
