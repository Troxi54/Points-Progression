import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format } from "../format";

function Softcapper() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player } = context;

  return (
    <div id="softcapper">
      <h2>Softcapper</h2>
      {player.bestSoftcapperLevel.greaterThanOrEqualTo(1) && (
        <p className="softcap-1">Level 1: at {format(settings.firstSoftcapperLevelAt)} - ^{format(settings.firstSoftcapperLevelPower)} point gain{player.softcapperLevel.greaterThanOrEqualTo(1) ? ' (Active)' : ''}</p>
      )}
    </div>
  );
}

export default Softcapper;