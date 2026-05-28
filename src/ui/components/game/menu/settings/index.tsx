import settingsIcon from "@ui/assets/settings.svg";
import Image from "@ui/components/base/Image";
import { useMenu } from "@ui/hooks/useMenu";

const SettingsButton = () => {
  const { open } = useMenu();

  return (
    <button onClick={() => open("settings")} aria-label="Open settings">
      <Image src={settingsIcon} name="Settings" className="h-9/10" />
    </button>
  );
};

export default SettingsButton;
