import { formatNumber } from "@core/format/number";
import { formatBestRunTime } from "@core/format/time";
import ResetLayerProgressBar from "@ui/components/base/ProgressBar/ResetLayer";
import { formatEffectOnCurrency } from "@core/format/effect";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import resetResetLayerConfig from "@game/resetLayers/data/layers/reset/config";
import NexusSign from "../base/NexusSign";

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
              bestRun.lessThanOrEqualTo(resetResetLayerConfig.bestRunLimit) &&
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
