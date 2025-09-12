import { format, formatLeftTime, integerFormat } from "@/format";
import { settings } from "@player/settings";
import { usePlayer } from "@player/playerStore";
import { calculateProgressInPercentage } from "@utils/progressUtils";
import { calculateTimeForRequirement } from "@utils/timeUtils";

function TierBar() {
  const {
    points,
    pointGain,
    autoTierEnabled,
    boughtSecondVermyrosUpgrade,
    tierRequirement,
    everMadeTier,
    tier,
    tierEffect,
    madeTierTimes,
    tierTimesEffect,
    stableProgressBars,
    approximateTiersPerSecond
  } = usePlayer((state) => ({
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain,
    autoTierEnabled: state.player.autoTierEnabled,
    boughtSecondVermyrosUpgrade: state.player.boughtSecondVermyrosUpgrade,
    tierRequirement: state.cachedPlayer.tierRequirement,
    everMadeTier: state.player.everMadeTier,
    tier: state.player.tier,
    tierEffect: state.cachedPlayer.tierEffect,
    madeTierTimes: state.player.madeTierTimes,
    tierTimesEffect: state.cachedPlayer.tierTimesEffect,
    stableProgressBars: state.player.stableProgressBars,
    approximateTiersPerSecond: state.player.approximateTiersPerSecond
  }));

  const useFirstTierRequirement =
    (points.lessThan(settings.firstTierAt) || autoTierEnabled) &&
    !boughtSecondVermyrosUpgrade;

  const currentRequirement = useFirstTierRequirement
    ? settings.firstTierAt
    : tierRequirement;

  let progress = calculateProgressInPercentage(points, currentRequirement);
  const stable =
    stableProgressBars &&
    approximateTiersPerSecond.greaterThan(
      settings.stableProgressBarsStartWorkingAt
    );

  const isStable = stable && !boughtSecondVermyrosUpgrade;
  if (isStable) progress = 100;

  const timeLeft = calculateTimeForRequirement(
    points,
    pointGain,
    settings.firstTierAt
  );
  const timeLeftForNextTier = calculateTimeForRequirement(
    points,
    pointGain,
    tierRequirement
  );

  return (
    <div className="relative">
      <p className="z-1">
        Goal: {format(settings.firstTierAt)} -{" "}
        <span className="text-time">
          {isStable ? "Ready" : formatLeftTime(timeLeft)}
        </span>
        {everMadeTier && (
          <span>
            , For next Tier: {format(tierRequirement)} -{" "}
            <span className="text-time">
              {isStable ? "Never" : formatLeftTime(timeLeftForNextTier)}
            </span>
            &emsp;|&emsp;Tier: {format(tier, 0)} -{" "}
            <span className="text-tier-effect">
              Effect: {format(tierEffect)}x
            </span>
            &emsp;|&emsp;Resets made: {integerFormat(madeTierTimes)} -{" "}
            <span className="text-tier-effect">
              Effect: {format(tierTimesEffect)}x
            </span>
          </span>
        )}
      </p>
      <div
        className="progress-bar bg-tier"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default TierBar;
