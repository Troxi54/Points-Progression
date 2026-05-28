import { formatLeftTime, formatTime } from "@core/format/time";
import { calculateTimeForRequirement } from "@core/utils/time";
import offlineConfig from "@game/offline/config";
import { skipOfflineProgress } from "@game/offline/utils/trigger";
import { getPlayerState } from "@game/player/store";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import ProgressBar from "@ui/components/base/ProgressBar";
import { useMenu } from "@ui/hooks/useMenu";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useEffect } from "react";
import Overlay from "../overlay";
import Paragraph from "@ui/components/base/Paragraph";
import Heading from "@ui/components/base/Heading";

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
  }, [offlineProgress, closeAllExcept, open, close]);

  const progress =
    offlineProgressTicksCompleted / offlineProgressTicksOnTrigger;
  const leftTime = calculateTimeForRequirement(
    offlineProgressTicksCompleted,
    offlineProgressSpeed * ticksPerSecond,
    offlineProgressTicksOnTrigger,
  );

  return (
    <Overlay menuId="offline" blockClosing>
      <Heading level={2} className="m-0">
        Welcome back!
      </Heading>
      <Paragraph>
        You haven't been here for{" "}
        <span className="text-time">{formatTime(offlineProgressFullTime)}</span>
        . Calculating your offline progress...
      </Paragraph>
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
          <Paragraph>Speed up</Paragraph>
        </button>
        <button className="menu-button" onClick={() => skipOfflineProgress()}>
          <Paragraph>Skip</Paragraph>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
}

export default OfflineMenu;
