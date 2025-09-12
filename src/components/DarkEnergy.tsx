import { format, formatWithPlural } from "@/format";
import { usePlayer } from "@player/playerStore";

function DarkEnergy() {
  const { darkEnergy, darkEnergyGain, darkEnergyEffect } = usePlayer(
    (state) => ({
      darkEnergy: state.player.darkEnergy,
      darkEnergyGain: state.cachedPlayer.darkEnergyGain,
      darkEnergyEffect: state.cachedPlayer.darkEnergyEffect
    })
  );

  return (
    <div className="bg-dark-energy-bg">
      <p className="dark-energy">
        Dark energy: {format(darkEnergy)}{" "}
        {darkEnergyGain.gt(0) && <>(+{format(darkEnergyGain)}/s)</>}
        <span className="text-dark-energy-effect text-shadow-none">
          {" "}
          - Effect:{" "}
          {formatWithPlural(darkEnergyEffect, "Energy Reactors", "x ")}
        </span>
      </p>
    </div>
  );
}

export default DarkEnergy;
