import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { triggerVermyrosReset } from "../../Resets";
import { format, formatLeftTime } from "../format";

function Amplivault() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;

  function enterAmplivault() {
    setPlayer(prev => ({
      ...prev,
      ...triggerVermyrosReset(prev),
      enteredAmplivault: !prev.enteredAmplivault
    }))
  }

  const animationPaused = !player.enteredAmplivault;
  const animationStyle = {animationPlayState: animationPaused ? 'paused' : ''};
  const leftTime = player.amplivaultRequirement.minus(player.points).dividedBy(player.pointGain).multiply(1000).max(0);
  return (
    <div>
      <button className="flex items-center flex-col bg-amplivault-bg hover:border-amplivault-hover-border" onClick={enterAmplivault}>
        <div className="relative w-20 h-20 bg-amplivault-div-bg border-2 border-amplivault-div-border">
          <div className="absolute size-full bg-amplivault-div-2-bg border-2 border-amplivault-div-2-border rounded-full"></div>
          <div id="amplivault-line-container" className="relative w-[calc(100%/1.4142-2px)] aspect-square bg-amplivault-div-3-bg border-2 border-amplivault-div-3-border animate-[amplivault-animation_1.5s_linear_infinite]" style={animationStyle}>
            <div className={animationStyle.animationPlayState}></div>
            <div className={animationStyle.animationPlayState}></div>
          </div>
        </div>
        <p className="text-amplivault-info">Amplivault - <span className="text-amplivault-description">Entering the Amplivault triggers a Vermyros reset. While inside, you can't buy the Upgrade, and you need to reach the requirement to increase your Amplivault level. Amplivault level boosts Ampliflux.</span><br/><br/>Amplivault level: {format(player.amplivaultLevel, 0)}, for the next: {format(player.amplivaultRequirement)}{player.enteredAmplivault && (<> - <span className="text-amplivault-description">{formatLeftTime(leftTime)}</span></>)}{player.amplivaultLevel.greaterThan(0) && (<><br/><span className="text-amplivault-description">Effect: {format(player.amplivaultEffect)}x ampliflux</span></>)}</p>
      </button>
    </div>
  );
}

export default Amplivault;