import Container from "@ui/components/base/Container";
import InfoButton from "./info";
import InfoMenu from "./info/menu";
import OfflineMenu from "./offline";
import PromptRoot from "./prompt";
import MenuProvider from "./provider";
import SettingsButton from "./settings";
import SettingsMenu from "./settings/menu";
import ExportMenu from "./settings/export";
import ImportMenu from "./settings/import";

function Menu() {
  return (
    <MenuProvider>
      <Container
        asChild
        className="bg-open-menu-container-bg fixed top-0 right-0 z-10 h-[8vmin] w-fit flex-row-reverse justify-start gap-[0.5em] rounded-bl-[1em] p-[0.6em] text-[1.6vmin] select-text"
      >
        <nav>
          <SettingsButton />
          <InfoButton />

          <PromptRoot />

          <SettingsMenu />
          <InfoMenu />

          <ImportMenu />
          <ExportMenu />
        </nav>
      </Container>
      <OfflineMenu />
    </MenuProvider>
  );
}

export default Menu;
