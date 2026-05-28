import { handleVisibilityChangeOffline } from "@game/offline/utils/trigger";
import { savePlayer } from "@game/player/persistence/save";
import { getPlayerState } from "@game/player/store";
import { useEffect } from "react";

function useGlobalEvents(): void {
  useEffect(() => {
    function handleBeforeUnload() {
      const { player } = getPlayerState();

      if (!player.saveBeforeUnload) return;

      savePlayer();
    }

    function handleVisibilityChange() {
      handleVisibilityChangeOffline();
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
