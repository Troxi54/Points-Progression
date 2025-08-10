import { format, formatLeftTime, formatWithPlural } from "../format";
import { settings } from "../player/settings";
import { usePlayer } from "../player/playerStore";
import {
  calculateProgressInPercentage,
  calculateTimeForRequirement
} from "../utils";

function MallirtBar() {
  const {
    dertoints,
    dertointGain,
    everMadeMallirt,
    mallirtTotalDertoints,
    mallirtEffect,
    stableProgressBars,
    approximateMallirtResetsPerSecond
  } = usePlayer((state) => ({
    dertoints: state.player.dertoints,
    dertointGain: state.cachedPlayer.dertointGain,
    everMadeMallirt: state.player.everMadeMallirt,
    mallirtTotalDertoints: state.player.mallirtTotalDertoints,
    mallirtEffect: state.cachedPlayer.mallirtEffect,
    stableProgressBars: state.player.stableProgressBars,
    approximateMallirtResetsPerSecond:
      state.player.approximateMallirtResetsPerSecond
  }));

  let progress = calculateProgressInPercentage(dertoints, settings.mallirtGoal);

  const stable =
    stableProgressBars &&
    approximateMallirtResetsPerSecond.greaterThan(
      settings.stableProgressBarsStartWorkingAt
    );
  if (stable) progress = 100;
  const timeLeft = calculateTimeForRequirement(
    dertoints,
    dertointGain,
    settings.mallirtGoal
  );
  return (
    <div className="relative">
      <p className="z-1">
        Goal: {formatWithPlural(settings.mallirtGoal, "Dertoint")} -{" "}
        <span className="text-time">
          {stable ? "Ready" : formatLeftTime(timeLeft)}
        </span>
        {everMadeMallirt && (
          <span>
            &emsp;|&emsp;Total Dertoints: {format(mallirtTotalDertoints)} -{" "}
            <span className="text-mallirt-effect">
              Effect: {formatWithPlural(mallirtEffect, "Dertoint", "x ")}
            </span>
          </span>
        )}
      </p>
      <div
        className="progress-bar bg-mallirt-bar"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default MallirtBar;
