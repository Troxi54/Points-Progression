import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { format, formatLeftTime } from "../format";

function NullithBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  let progress = +Decimal.min(player.points.dividedBy(settings.nullithGoal), 1).multiply(100);
  const stable = player.stableProgressBars && player.approximateNullithResetsPerSecond.greaterThan(5);
  if (stable) progress = 100;
  const timeLeft = Decimal.max(settings.nullithGoal.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="relative">
      <p className="z-1">Goal: {format(settings.nullithGoal)} - <span className="text-time">{stable ? 'Ready' : formatLeftTime(timeLeft)}</span>{player.everMadeNullith && (<>&emsp;|&emsp;Resets made: {(+player.madeNullithResets.floor()).toLocaleString('en-US')} - <span className="text-nullith-effect">Effect: {format(player.nullithResetsEffect)}x, {format(player.nullithResetsVermyteEffect)}x vermytes, {format(player.nullithResetsEnergyEffect)}x energy</span></>)}</p>
      <div className="nullith-bar-container">
        <div className="progress-bar progress-bar-inner left-[unset] right-0" style={{width: `${100 - progress}%`}}></div>
      </div>
    </div>
  )
}

export default NullithBar;