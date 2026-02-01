import HorizontalContainer from "@/ui/components/base/HorizontalContainer";
import Overlay from "../overlay";
import { importPlayer } from "@/game/player/persistence/import";
import { ChangeEvent, useRef } from "react";
import { resetPlayerDataAndGame } from "@/game/player/utils";
import Tooltip from "@/ui/components/base/Tooltip";
import { useMenu } from "../provider";
import { showPrompt } from "../prompt/service";

function ImportMenu() {
  const { closeAll } = useMenu();
  const closeMenu = () => closeAll();

  async function fromText() {
    const userText = await showPrompt({
      title: "Import from text",
      message: "Enter your save data here. The current data will be lost.",
    });

    if (userText) {
      closeMenu();
      importPlayer(userText);
    }
  }

  function fromFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return alert("No file");
    }
    if (file.type !== "text/plain") {
      return alert("Wrong file type");
    }

    const reader = new FileReader();
    reader.onload = (e) => importPlayer(e.target?.result as string);

    closeMenu();
    reader.readAsText(file);
  }

  async function importDefaultData() {
    const userText = await showPrompt({
      title: "Reset data",
      message:
        "Warning: this will permanently clear your progress. Type 'confirm' (any case) to proceed.",
    });

    if (userText?.toLowerCase() === "confirm") {
      closeMenu();
      resetPlayerDataAndGame();
    }
  }

  const fromFileInput = useRef<HTMLInputElement | null>(null);

  return (
    <Overlay menuId="settings/import" menuClassName="p-[2em]">
      <h1 className="m-0">Import</h1>
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Import from text"
          onClick={fromText}
        >
          <p>From text</p>
        </button>
        <button
          className="menu-button"
          onClick={() => fromFileInput.current?.click()}
        >
          <p>From file</p>
          <input
            ref={fromFileInput}
            type="file"
            aria-label="Import from file"
            hidden
            onChange={fromFile}
            accept="text/plain"
          />
        </button>
        <button
          className="menu-button bg-negative-menu-button-bg hover:bg-negative-menu-button-bg-hover"
          onClick={importDefaultData}
        >
          <p className="text-negative-menu-button-text">Default player data</p>
          <Tooltip>Resets your data</Tooltip>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
}

export default ImportMenu;
