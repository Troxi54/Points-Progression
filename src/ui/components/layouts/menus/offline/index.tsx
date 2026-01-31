import { usePlayerFields } from "@/ui/hooks/usePlayer";
import Overlay from "../overlay";
import { formatLeftTime, formatTime } from "@/core/format/time";
import { useMenu } from "../provider";
import { useEffect } from "react";
import ProgressBar from "@/ui/components/base/ProgressBar";
import HorizontalContainer from "@/ui/components/base/HorizontalContainer";
import { getPlayerState } from "@/game/player/store/store";
import offlineConfig from "@/game/offline/config";
import { calculateTimeForRequirement } from "@/core/utils/time";
import { skipOfflineProgress } from "@/game/offline/utils/trigger";

function OfflineMenu() {
  const { open, close, closeAllExcept } = useMenu();

  const {
    offlineProgress,
    offlineProgressFullTime,
    offlineProgressTicksCompleted,
    offlineProgressSpeed,
    ticksPerSecond
  } = usePlayerFields({
    cachedPlayer: [
      "offlineProgress",
      "offlineProgressFullTime",
      "offlineProgressTicksCompleted",
      "offlineProgressSpeed",
      "ticksPerSecond"
    ]
  });

  useEffect(() => {
    if (offlineProgress) {
      closeAllExcept("offline");
      open("offline");
    } else {
      close("offline");
    }
  }, [offlineProgress]);

  const { ticksOnTrigger } = offlineConfig;

  const progress = offlineProgressTicksCompleted / ticksOnTrigger;
  let leftTime = calculateTimeForRequirement(
    offlineProgressTicksCompleted,
    offlineProgressSpeed * ticksPerSecond,
    ticksOnTrigger
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
        <p className="z-1">
          Ticks: {offlineProgressTicksCompleted} / {ticksOnTrigger}{" "}
          <span className="text-offline-time">
            ({formatLeftTime(leftTime)})
          </span>
        </p>
      </ProgressBar>
      <HorizontalContainer>
        <button
          className="menu-button"
          onClick={() => {
            const { cachedPlayer, setCachedPlayer } = getPlayerState();

            setCachedPlayer({
              offlineProgressSpeed: cachedPlayer.offlineProgressSpeed * 2
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
