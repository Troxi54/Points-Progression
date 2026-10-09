import {
  exportPlayerToClipboard,
  exportPlayerToFile,
} from "@game/player/persistence/export";
import Button from "@ui/components/base/Button";
import Heading from "@ui/components/base/Heading";
import Stack from "@ui/components/base/Stack";
import { useMenu } from "@ui/hooks/useMenu";
import Overlay from "../overlay";

const ExportMenu = () => {
  const { close } = useMenu();
  const closeMenu = () => close("settings/export");

  async function exportText() {
    await exportPlayerToClipboard();

    closeMenu();
  }

  function exportFile() {
    exportPlayerToFile();

    closeMenu();
  }

  return (
    <Overlay menuId="settings/export" menuClassName="p-[2em]">
      <Heading level={2} className="m-0">
        Export
      </Heading>
      <Stack>
        <Button
          variant="menu"
          aria-label="Export to clipboard"
          onClick={exportText}
        >
          To clipboard
        </Button>
        <Button variant="menu" aria-label="Export file" onClick={exportFile}>
          File
        </Button>
      </Stack>
    </Overlay>
  );
};

export default ExportMenu;
