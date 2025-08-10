import { format, formatLeftTime, formatTime } from "../format";
import { settings } from "../player/settings";
import { usePlayer } from "../player/playerStore";
import {
  calculateProgressInPercentage,
  calculateTimeForRequirement
} from "../utils";

function ProgressionBar() {
  const {
    points,
    pointGain,
    bestRun,
    everMadeRun,
    runEffect,
    bestPointsOfRun,
    bestPointsOfRunEffect,
    stableProgressBars,
    approximateResetsPerSecond
  } = usePlayer((state) => ({
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain,
    bestRun: state.player.bestRun,
    everMadeRun: state.player.everMadeRun,
    runEffect: state.cachedPlayer.runEffect,
    bestPointsOfRun: state.player.bestPointsOfRun,
    bestPointsOfRunEffect: state.cachedPlayer.bestPointsOfRunEffect,
    stableProgressBars: state.player.stableProgressBars,
    approximateResetsPerSecond: state.player.approximateResetsPerSecond
  }));

  let progress = calculateProgressInPercentage(
    points,
    settings.firstResetLayerGoal
  );

  const stable =
    stableProgressBars &&
    approximateResetsPerSecond.greaterThan(
      settings.stableProgressBarsStartWorkingAt
    );
  if (stable) progress = 100;
  const timeLeft = calculateTimeForRequirement(
    points,
    pointGain,
    settings.firstResetLayerGoal
  );
  return (
    <div className="relative">
      <p className="z-1">
        Goal: {format(settings.firstResetLayerGoal)} -{" "}
        <span className="text-time">
          {stable ? "Ready" : formatLeftTime(timeLeft)}
        </span>
        {everMadeRun && (
          <span>
            &emsp;|&emsp;Best run:{" "}
            {bestRun === null ? "no" : formatTime(bestRun)}
            {bestRun && bestRun <= settings.bestRunTimeLimit
              ? " (limit)"
              : ""}{" "}
            -{" "}
            <span className="text-reset-effect">
              Effect: {format(runEffect)}x
            </span>
            &emsp;|&emsp;Best Points: {format(bestPointsOfRun)} -{" "}
            <span className="text-reset-effect">
              Effect: {format(bestPointsOfRunEffect)}x
            </span>
          </span>
        )}
      </p>
      <div
        className="progress-bar bg-reset-bar"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressionBar;
