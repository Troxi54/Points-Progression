import { formatTime } from "@/format";
import { usePlayer } from "@player/playerStore";

function TimeSpent() {
  const {
    tierStartedDate,
    vermyrosStartedDate,
    nullithStartedDate,
    timeSinceHighestReset
  } = usePlayer((state) => ({
    tierStartedDate: state.player.tierStartedDate,
    vermyrosStartedDate: state.player.vermyrosStartedDate,
    nullithStartedDate: state.player.nullithStartedDate,
    timeSinceHighestReset: state.cachedPlayer.timeSinceHighestReset
  }));

  return (
    <div>
      <p>
        Time spent this run:{" "}
        {nullithStartedDate === null ? (
          vermyrosStartedDate === null ? (
            tierStartedDate === null ? (
              formatTime(timeSinceHighestReset)
            ) : (
              <>
                <span>{formatTime(timeSinceHighestReset)}</span>{" "}
                <span className="text-tier">(T)</span>
              </>
            )
          ) : (
            <>
              <span>{formatTime(timeSinceHighestReset)}</span>{" "}
              <span className="text-vermyros">(V)</span>
            </>
          )
        ) : (
          <>
            {formatTime(timeSinceHighestReset)}{" "}
            <span className="nullith">(N)</span>
          </>
        )}
      </p>
    </div>
  );
}

export default TimeSpent;
