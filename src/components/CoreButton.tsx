import { format, formatWithPlural } from "../format";
import { usePlayer } from "../player/playerStore";
import { settings } from "../player/settings";
import { convertEnergyIntoCores } from "../playerActions";

function CoreButton() {
  const { everReachedCores, coreGain } = usePlayer((state) => ({
    everReachedCores: state.player.everReachedCores,
    coreGain: state.cachedPlayer.coreGain
  }));

  return (
    <button
      id="cores-button"
      className="bg-core-bg"
      onClick={convertEnergyIntoCores}
    >
      <p id="cores-info">
        {everReachedCores ? (
          <>
            <span className="text-core-description">
              Converting energy into cores resets energy reactors
            </span>
            <br />
            You will gain {formatWithPlural(coreGain, "Core")}
          </>
        ) : (
          <>You need {format(settings.coresAt)} energy for this</>
        )}
      </p>
    </button>
  );
}

export default CoreButton;
