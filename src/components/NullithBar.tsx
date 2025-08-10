import {
  format,
  formatLeftTime,
  formatWithPlural,
  integerFormat
} from "../format";
import { usePlayer } from "../player/playerStore";
import {
  calculateProgressInPercentage,
  calculateTimeForRequirement
} from "../utils";
import { settings } from "../player/settings";

function NullithBar() {
  const {
    points,
    pointGain,
    stableProgressBars,
    approximateNullithResetsPerSecond,
    everMadeNullith,
    madeNullithResets,
    nullithResetsEffect,
    nullithResetsVermyteEffect,
    nullithResetsEnergyEffect
  } = usePlayer((state) => ({
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain,
    stableProgressBars: state.player.stableProgressBars,
    approximateNullithResetsPerSecond:
      state.player.approximateNullithResetsPerSecond,
    everMadeNullith: state.player.everMadeNullith,
    madeNullithResets: state.player.madeNullithResets,
    nullithResetsEffect: state.cachedPlayer.nullithResetsEffect,
    nullithResetsVermyteEffect: state.cachedPlayer.nullithResetsVermyteEffect,
    nullithResetsEnergyEffect: state.cachedPlayer.nullithResetsEnergyEffect
  }));

  let progress = calculateProgressInPercentage(points, settings.nullithGoal);
  const stable =
    stableProgressBars &&
    approximateNullithResetsPerSecond.greaterThan(
      settings.stableProgressBarsStartWorkingAt
    );
  if (stable) progress = 100;

  const timeLeft = calculateTimeForRequirement(
    points,
    pointGain,
    settings.nullithGoal
  );

  return (
    <div className="relative">
      <p className="z-1">
        Goal: {format(settings.nullithGoal)} -{" "}
        <span className="text-time">
          {stable ? "Ready" : formatLeftTime(timeLeft)}
        </span>
        {everMadeNullith && (
          <>
            &emsp;|&emsp;Resets made: {integerFormat(madeNullithResets)} -{" "}
            <span className="text-nullith-effect">
              Effect: {format(nullithResetsEffect)}x,{" "}
              <span className="text-vermyros-effect">
                {formatWithPlural(nullithResetsVermyteEffect, "Vermytes", "x ")}
              </span>
              ,{" "}
              <span className="text-energy-effect">
                {formatWithPlural(nullithResetsEnergyEffect, "Energy", "x ")}
              </span>
            </span>
          </>
        )}
      </p>
      <div className="nullith-bar-container">
        <div
          className="progress-bar progress-bar-inner left-[unset] right-0"
          style={{ width: `${100 - progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default NullithBar;
