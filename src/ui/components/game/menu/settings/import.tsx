import type { ChangeEvent } from "react";
import { importPlayer } from "@game/player/persistence/import";
import { resetPlayerDataAndGame } from "@game/player/utils";
import Button from "@ui/components/base/Button";
import Heading from "@ui/components/base/Heading";
import Stack from "@ui/components/base/Stack";
import Tooltip from "@ui/components/base/Tooltip";
import { useMenu } from "@ui/hooks/useMenu";
import { useRef } from "react";
import Overlay from "../overlay";
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

  const fromFileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Overlay menuId="settings/import" menuClassName="p-[2em]">
      <Heading level={2} className="m-0">
        Import
      </Heading>
      <Stack>
        <Button variant="menu" aria-label="Import from text" onClick={fromText}>
          From text
        </Button>
        <Button
          variant="menu"
          onClick={() => fromFileInputRef.current?.click()}
        >
          From file
          <input
            ref={fromFileInputRef}
            type="file"
            aria-label="Import from file"
            hidden
            onChange={fromFile}
            accept="text/plain"
          />
        </Button>
        <Button variant="menu-danger" onClick={importDefaultData}>
          Default player data
          <Tooltip>Resets your data</Tooltip>
        </Button>
      </Stack>
    </Overlay>
  );
}

export default ImportMenu;
