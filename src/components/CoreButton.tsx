import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format } from "../format";
import Decimal from "break_eternity.js";

function CoreButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, playerRef, setPlayer } = context;

  function convert() {
    if (playerRef.current.energy.lessThan(settings.coresAt)) return;
    setPlayer(prev => ({
      ...prev,
      everMadeCoreReset: true,
      cores: prev.cores.plus(prev.coreGain),
      energyReactors: new Decimal(0),
      energy: new Decimal(0),
    }));
  }

  function contextMenu(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    convert();
  }

  return (
    <div className="bg-core-bg">
      <button id="cores-button" onClick={convert} onContextMenu={contextMenu}>
        <p id="cores-info">{player.everReachedCores ? <><span className="text-core-description">Converting energy into cores resets energy reactors</span><br/>You will gain {format(player.coreGain)} cores</> 
                                                    : <>You need {format(settings.coresAt)} energy for this</>}</p>
      </button>
    </div>
  )
}

export default CoreButton;