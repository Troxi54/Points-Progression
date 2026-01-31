import { useEffect } from "react";
import { getPlayerState } from "@/game/player/store/store";
import { savePlayer } from "@/game/player/persistence/save";
import { triggerOfflineProgress } from "@/game/offline/utils/trigger";

function useGlobalEvents(): void {
  useEffect(() => {
    function handleBeforeUnload() {
      const { player } = getPlayerState();

      if (!player.saveBeforeUnload) return;

      savePlayer();
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        triggerOfflineProgress();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}

export default useGlobalEvents;
