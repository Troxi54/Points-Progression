import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Overlay from "../overlay";
import { formatLeftTime, formatTime } from "@core/format/time";
import { useMenu } from "../provider";
import { useEffect } from "react";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import { getPlayerState } from "@game/player/store/store";
import offlineConfig from "@game/offline/config";
import { calculateTimeForRequirement } from "@core/utils/time";
import { skipOfflineProgress } from "@game/offline/utils/trigger";
import ProgressBar from "@ui/components/base/ProgressBar";

function OfflineMenu() {
  const { open, close, closeAllExcept } = useMenu();

  const {
    offlineProgress,
    offlineProgressFullTime,
    offlineProgressTicksCompleted,
    offlineProgressSpeed,
    offlineProgressTicksOnTrigger,
    ticksPerSecond,
  } = usePlayerFields({
    cachedPlayer: [
      "offlineProgress",
      "offlineProgressFullTime",
      "offlineProgressTicksCompleted",
      "offlineProgressTicksOnTrigger",
      "offlineProgressSpeed",
      "ticksPerSecond",
    ],
  });

  useEffect(() => {
    if (offlineProgress) {
      closeAllExcept("offline");
      open("offline");
    } else {
      close("offline");
    }
  }, [offlineProgress]);

  const progress =
    offlineProgressTicksCompleted / offlineProgressTicksOnTrigger;
  let leftTime = calculateTimeForRequirement(
    offlineProgressTicksCompleted,
    offlineProgressSpeed * ticksPerSecond,
    offlineProgressTicksOnTrigger,
  );

  return (
    <Overlay menuId="offline" blockClosing>
      <h1 className="m-0">Welcome back!</h1>
      <p>
        You haven't been here for{" "}
        <span className="text-time">{formatTime(offlineProgressFullTime)}</span>
        . Calculating your offline progress...
      </p>
      <ProgressBar
        progress={progress}
        progressBarClassName="w-9/10 rounded-[0.5em] overflow-hidden"
        progressFillClassName="bg-offline-bar"
      >
        Ticks: {offlineProgressTicksCompleted} / {offlineProgressTicksOnTrigger}{" "}
        <span className="text-offline-time">({formatLeftTime(leftTime)})</span>
      </ProgressBar>
      <HorizontalContainer>
        <button
          className="menu-button"
          onClick={() => {
            const { cachedPlayer, setCachedPlayer } = getPlayerState();
            const currentSpeed = cachedPlayer.offlineProgressSpeed;
            const finiteSpeed =
              Number.isFinite(currentSpeed) && currentSpeed > 0
                ? currentSpeed
                : 1;

            setCachedPlayer({
              offlineProgressSpeed: Math.min(
                finiteSpeed * 2,
                offlineConfig.maxSpeed,
              ),
            });
          }}
        >
          <p>Speed up</p>
        </button>
        <button className="menu-button" onClick={skipOfflineProgress}>
          <p>Skip</p>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
}

export default OfflineMenu;
