import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { format, formatLeftTime } from "../format";

function VermyrosBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  let progress = +Decimal.min(player.points.dividedBy(settings.vermyrosGoal), 1).multiply(100);
  const stable = player.stableProgressBars && player.approximateVermyrosResetsPerSecond.greaterThan(5);
  if (stable) progress = 100;
  const timeLeft = Decimal.max(settings.vermyrosGoal.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="relative">
      <p className="z-1">Goal: {format(settings.vermyrosGoal)} - <span className="text-time">{stable ? 'Ready' : formatLeftTime(timeLeft)}</span>{player.everMadeVermyros && (<span>&emsp;|&emsp;Best vermytes: {format(player.bestVermytes)} - <span className="text-vermyros-effect">Effect: {format(player.vermytesBestEffect)}x vermora</span></span>)}</p>
      <div className="vermyros-bar-container">
        <div className="progress-bar progress-bar-inner left-[unset] right-0" style={{width: `${100 - progress}%`}}></div>
      </div>
    </div>
  )
}

export default VermyrosBar;