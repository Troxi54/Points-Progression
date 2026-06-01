import settingsIcon from "@ui/assets/settings.svg";
import Button from "@ui/components/base/Button";
import Image from "@ui/components/base/Image";
import { useMenu } from "@ui/hooks/useMenu";

const SettingsButton = () => {
  const { open, isOpen } = useMenu();

  return (
    <Button
      onClick={() => open("settings")}
      variant="menu-toggle"
      aria-label="Open settings"
      aria-haspopup="dialog"
      aria-expanded={isOpen("settings")}
      aria-controls="settings"
    >
      <Image src={settingsIcon} alt="" className="h-9/10" />
    </Button>
  );
};

export default SettingsButton;
