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
    <div className="flex-col bg-linear-to-r from-softcapper-bg-1 to-softcapper-bg-2">
      <h2 className="text-gradient bg-linear-to-l from-softcapper-h-1 to-softcapper-h-2 text-[2em] mb-[.4em]">Softcapper</h2>
      {player.bestSoftcapperLevel.greaterThanOrEqualTo(1) && (
        <p className="softcap-1">Level 1: at {format(settings.firstSoftcapperLevelAt)} - ^{format(settings.firstSoftcapperLevelPower)} point gain{player.softcapperLevel.greaterThanOrEqualTo(1) ? ' (Active)' : ''}</p>
      )}
    </div>
  );
}

export default Softcapper;