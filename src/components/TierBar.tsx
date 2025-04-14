import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { format, formatLeftTime } from "../format";

function TierBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  let progress = +Decimal.min(player.points.dividedBy((player.points.lessThan(settings.firstTierAt) || player.autoTierEnabled) && !player.boughtSecondVermyrosUpgrade ? settings.firstTierAt : player.tierRequirement), 1).multiply(100);
  const stable = player.stableProgressBars && player.approximateTiersPerSecond.greaterThan(5);
  if (stable) progress = 100;
  const timeLeft = Decimal.max(settings.firstTierAt.minus(player.points).div(player.pointGain).multiply(1000), 0);
  const timeLeftForNextTier = Decimal.max(player.tierRequirement.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="relative">
      <p className="z-1">Goal: {format(settings.firstTierAt)} - <span className="text-time">{stable ? 'Ready' :formatLeftTime(timeLeft)}</span>{player.everMadeTier && (<span>, For next Tier: {format(player.tierRequirement)} - <span className="text-time">{formatLeftTime(timeLeftForNextTier)}</span>&emsp;|&emsp;Tier: {format(player.tier, 0)} - <span className="text-tier-effect">Effect: {format(player.tierEffect)}x</span>&emsp;|&emsp;Resets made: {(+player.madeTierTimes.floor()).toLocaleString('en-US')} - <span className="text-tier-effect">Effect: {format(player.tierTimesEffect)}x</span></span>)}</p>
      <div className="progress-bar bg-tier" style={{width: `${progress}%`}}></div>
    </div>
  )
}

export default TierBar;