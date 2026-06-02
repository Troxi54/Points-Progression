import { exportPlayer } from "@game/player/persistence/export";
import Button from "@ui/components/base/Button";
import Heading from "@ui/components/base/Heading";
import Stack from "@ui/components/base/Stack";
import { useMenu } from "@ui/hooks/useMenu";
import Overlay from "../overlay";

const ExportMenu = () => {
  const { close } = useMenu();
  const closeMenu = () => close("settings/export");

  function exportText() {
    const data = exportPlayer();

    navigator.clipboard
      .writeText(data)
      .then(closeMenu)
      .catch((error) => `Unsuccessful copy to clipboard, ${error}`);
  }

  function exportFile() {
    const data = exportPlayer();

    const time = new Date();
    const fileName = `Points Progression ${time
      .toLocaleTimeString()
      .replace(/:/g, "-")} ${time
      .toLocaleDateString()
      .replace(/\//g, "-")}.txt`;

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);

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
