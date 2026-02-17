import { formatNumber, integerCommaFormat } from "@/core/format/number";
import { formatLeftTime } from "@/core/format/time";
import { calculateProgress } from "@/core/utils/progress";
import { calculateTimeForRequirement } from "@/core/utils/time";
import ResetLayerProgressBar from "@/ui/components/base/ResetLayerProgressBar";
import {
  getResetLayerData,
  getResetLayerPlayerDataProp,
} from "@/game/resetLayers/utils/get";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { formatEffectForCurrency } from "@/core/format/effect";
import { getCachedCurrencyProp } from "@/game/currencies/utils/get";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import CurrencyContent from "@/ui/components/base/CurrencyContent";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

function TierBar() {
  const data = getResetLayerData("tier");
  const { goal, currency } = data;

  return (
    <ResetLayerProgressBar
      resetLayerId="tier"
      progressFillClassName="bg-tier"
      customProgress={({ player, cachedPlayer }, currencyValue) => {
        const autoEnabled = getResetLayerPlayerDataProp(
          player,
          "tier",
          "autoEnabled",
        );

        const useFirstTierRequirement =
          (player.points.lessThan(goal) || autoEnabled) &&
          !hasUpgradeById(player, "vermyros_2");

        const currentRequirement = useFirstTierRequirement
          ? goal
          : cachedPlayer.tierRequirement;

        return calculateProgress(currencyValue, currentRequirement);
      }}
      labelParts={({ player, cachedPlayer }, isLocked) => {
        const pointGain = getCachedCurrencyProp(cachedPlayer, "points", "gain");

        const timeLeftForNextTier = calculateTimeForRequirement(
          player[currency],
          pointGain,
          cachedPlayer.tierRequirement,
        );

        const hasVermyros_2 = hasUpgradeById(player, "vermyros_2");

        return [
          <>
            For next Tier: {formatNumber(cachedPlayer.tierRequirement)} -{" "}
            <span className="text-time">
              {isLocked
                ? hasVermyros_2
                  ? "Ready"
                  : "Never"
                : formatLeftTime(timeLeftForNextTier)}
            </span>
          </>,
          <>
            Tier: {integerCommaFormat(player.tier)} -{" "}
            <span className="text-tier-effect">
              Effect:{" "}
              {formatEffectForCurrency(cachedPlayer.tierEffect, "points")}
              {hasNexusLevel(player, 4) && (
                <>
                  ,{" "}
                  {formatEffectForCurrency(
                    cachedPlayer.tierVermyteEffect,
                    "vermytes",
                  )}{" "}
                  <span className="text-(--nexus-milestone-4)">(N4)</span>
                </>
              )}
            </span>
          </>,
          <>
            <CurrencyContent
              currencyId="madeTierTimes"
              effectClassName="text-tier-effect"
              formatType="integerComma"
              effectNodes={[
                {
                  node: ({ cachedPlayer }) =>
                    formatCurrencyEffect(
                      cachedPlayer,
                      "madeTierTimes",
                      "points",
                    ),
                },
                {
                  works: ({ player }) => hasNexusLevel(player, 5),
                  node: ({ cachedPlayer }) => (
                    <>
                      {formatCurrencyEffect(
                        cachedPlayer,
                        "madeTierTimes",
                        "dertoints",
                      )}{" "}
                      <span className="text-(--nexus-milestone-5)">(N5)</span>
                    </>
                  ),
                },
              ]}
            />
          </>,
        ];
      }}
    />
  );
}

export default TierBar;
