import HorizontalContainer from "@/ui/components/base/HorizontalContainer";
import Overlay from "../overlay";
import { exportPlayer } from "@/game/player/persistence/export";
import { useMenu } from "../provider";

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
      .replace(/[:]/g, "-")} ${time
      .toLocaleDateString()
      .replace(/[/]/g, "-")}.txt`;

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
      <h1 className="m-0">Export</h1>
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Export to clipboard"
          onClick={exportText}
        >
          <p>To clipboard</p>
        </button>
        <button
          className="menu-button"
          aria-label="Export file"
          onClick={exportFile}
        >
          <p>File</p>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
};

export default ExportMenu;
