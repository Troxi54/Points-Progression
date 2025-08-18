import { format, formatLeftTime, formatWithPlural } from "../format";
import { usePlayer } from "../player/playerStore";
import {
  calculateProgressInPercentage,
  calculateTimeForRequirement
} from "../utils";
import { settings } from "../player/settings";

function VermyrosBar() {
  const {
    points,
    pointGain,
    everMadeVermyros,
    bestVermytes,
    vermytesBestEffect,
    stableProgressBars,
    approximateVermyrosResetsPerSecond
  } = usePlayer((state) => ({
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain,
    everMadeVermyros: state.player.everMadeVermyros,
    bestVermytes: state.player.bestVermytes,
    vermytesBestEffect: state.cachedPlayer.vermytesBestEffect,
    stableProgressBars: state.player.stableProgressBars,
    approximateVermyrosResetsPerSecond:
      state.player.approximateVermyrosResetsPerSecond
  }));

  let progress = calculateProgressInPercentage(points, settings.vermyrosGoal);

  const stable =
    stableProgressBars &&
    approximateVermyrosResetsPerSecond.greaterThan(
      settings.stableProgressBarsStartWorkingAt
    );
  if (stable) progress = 100;

  const timeLeft = calculateTimeForRequirement(
    points,
    pointGain,
    settings.vermyrosGoal
  );

  return (
    <div className="relative">
      <p className="z-1">
        Goal: {format(settings.vermyrosGoal)} -{" "}
        <span className="text-time">
          {stable ? "Ready" : formatLeftTime(timeLeft)}
        </span>
        {everMadeVermyros && (
          <span>
            &emsp;|&emsp;Best Vermytes on reset : {format(bestVermytes)} -{" "}
            <span className="text-vermyros-effect">
              Effect: {formatWithPlural(vermytesBestEffect, "Vermora", "x ")}
            </span>
          </span>
        )}
      </p>
      <div className="vermyros-bar-container">
        <div
          className="progress-bar progress-bar-inner left-[unset] right-0"
          style={{ width: `${100 - progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default VermyrosBar;
