import Button from "@ui/components/base/Button";
import SettingsIcon from "@ui/components/base/icons/Settings";
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
      <SettingsIcon className="size-7/10" />
    </Button>
  );
};

export default SettingsButton;
