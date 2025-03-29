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

  const animationPaused = player.enteredAmplivault ? '' : 'paused';
  const leftTime = player.amplivaultRequirement.minus(player.points).dividedBy(player.pointGain).multiply(1000).max(0);
  return (
    <div id="amplivault">
      <button id="amplivault-button" onClick={enterAmplivault}>
        <div id="amplivault-animation-div" className={animationPaused}>
          <div></div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
        <p id="amplivault-info">Amplivault - <span className="amplivault-description">Entering the Amplivault triggers a Vermyros reset. While inside, you can't buy the Upgrade, and you need to reach the requirement to increase your Amplivault level. Amplivault level boosts Ampliflux.</span><br/><br/>Amplivault level: {format(player.amplivaultLevel, 0)}, for the next: {format(player.amplivaultRequirement)}{player.enteredAmplivault && (<> - <span className="amplivault-description">{formatLeftTime(leftTime)}</span></>)}{player.amplivaultLevel.greaterThan(0) && (<><br/><span className="amplivault-description">Effect: {format(player.amplivaultEffect)}x ampliflux</span></>)}</p>
      </button>
    </div>
  );
}

export default Amplivault;