import { getPlayerState } from "@game/player/store";
import { serializePlayer } from "./compress";
import { getCurrentTime } from "@core/utils/time";
import gameConfig from "@core/config/data";

export function exportPlayer(): string {
  const { player } = getPlayerState();

  const serialized = serializePlayer(player);
  return serialized;
}

export async function exportPlayerToClipboard() {
  const data = exportPlayer();

  return navigator.clipboard
    .writeText(data)
    .catch((error) => `Unsuccessful copy to clipboard, ${error}`);
}

function createFileName(): string {
  const time = new Date(getCurrentTime());

  const date = [
    time.getFullYear(),
    String(time.getMonth() + 1).padStart(2, "0"),
    String(time.getDate()).padStart(2, "0"),
  ].join("-");

  const timeString = time
    .toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/:/g, "-")
    .replace(/[<>:"/\\|?*]/g, "-");

  return `${gameConfig.gameName} ${date}, ${timeString}.txt`;
}

export function exportPlayerToFile() {
  const data = exportPlayer();
  const fileName = createFileName();

  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  ``;
  link.click();

  URL.revokeObjectURL(url);
}
