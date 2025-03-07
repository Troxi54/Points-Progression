import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import Decimal from "break_eternity.js";
import { format, formatTime } from "../format";

function TierBar() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;
  const progress = +Decimal.min(player.points.dividedBy(player.points.lessThan(settings.firstTierAt) || player.autoTierEnabled ? settings.firstTierAt : player.tierRequirement), 1).multiply(100);
  const timeLeft = Decimal.max(settings.firstTierAt.minus(player.points).div(player.pointGain).multiply(1000), 0);
  const timeLeftForNextTier = Decimal.max(player.tierRequirement.minus(player.points).div(player.pointGain).multiply(1000), 0);
  return (
    <div className="progression-div">
      <p className="progression-info">Goal: {format(settings.firstTierAt)} - <span className="time">{timeLeft.greaterThanOrEqualTo('e16') ? 'Never' : timeLeft.greaterThan(0) ? formatTime(timeLeft) : 'Ready'}</span>{player.everMadeTier && (<span>, For next Tier: {format(player.tierRequirement)} - <span className="time">{timeLeftForNextTier.greaterThanOrEqualTo('e16') ? 'Never' : timeLeftForNextTier.greaterThan(0) ? formatTime(timeLeftForNextTier) : 'Ready'}</span>&emsp;|&emsp;Tier: {format(player.tier, 0)} - <span className="tier-effect">Effect: {format(player.tierEffect)}x</span>&emsp;|&emsp;Resets made: {+player.madeTierTimes.floor()} - <span className="tier-effect">Effect: {format(player.tierTimesEffect)}x</span></span>)}</p>
      <div className="progression-bar tier-bar" style={{width: `${progress}%`}}></div>
    </div>
  )
}

export default TierBar;