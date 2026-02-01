import { MenuProvider } from "./provider";
import InfoButton from "./info";
import SettingsButton from "./settings";
import InfoMenu from "./info/menu";
import SettingsMenu from "./settings/menu";
import ImportMenu from "./settings/import";
import ExportMenu from "./settings/export";
import OfflineMenu from "./offline";
import PromptRoot from "./prompt";

function Menu() {
  return (
    <MenuProvider>
      <div
        id="open-menu-buttons"
        className="fixed z-10 w-fit h-[8vmin] top-0 right-0 text-[1.6vmin] p-[0.6em] rounded-bl-[1em] justify-start flex-row-reverse gap-[0.5em] bg-open-menu-container-bg select-text"
      >
        <SettingsButton />
        <InfoButton />

        <OfflineMenu />
        <PromptRoot />

        <SettingsMenu />
        <InfoMenu />
        <ImportMenu />
        <ExportMenu />
      </div>
    </MenuProvider>
  );
}

export default Menu;
