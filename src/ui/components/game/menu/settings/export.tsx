import { exportPlayer } from "@game/player/persistence/export";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import { useMenu } from "@ui/hooks/useMenu";
import Overlay from "../overlay";
import Paragraph from "@ui/components/base/Paragraph";
import Heading from "@ui/components/base/Heading";

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
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Export to clipboard"
          onClick={exportText}
        >
          <Paragraph>To clipboard</Paragraph>
        </button>
        <button
          className="menu-button"
          aria-label="Export file"
          onClick={exportFile}
        >
          <Paragraph>File</Paragraph>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
};

export default ExportMenu;
