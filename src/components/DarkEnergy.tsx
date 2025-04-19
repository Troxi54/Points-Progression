import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";

function DarkEnergy() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  const { player } = context;

  return (
    <div className="bg-dark-energy-bg">
      <p className="dark-energy">Dark energy: {format(player.darkEnergy)} {player.darkEnergyGain.gt(0) && <>(+{format(player.darkEnergyGain)}/s)</>}<span className="text-dark-energy-effect text-shadow-none"> - Effect: {format(player.darkEnergyEffect)}x energy reactors</span></p>
    </div>
  );
  
}

export default DarkEnergy;