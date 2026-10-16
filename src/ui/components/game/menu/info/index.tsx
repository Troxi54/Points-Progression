import Button from "@ui/components/base/Button";
import InfoIcon from "@ui/components/base/icons/Info";
import { useMenu } from "@ui/hooks/useMenu";

const InfoButton = () => {
  const { open, isOpen } = useMenu();

  return (
    <Button
      onClick={() => open("info")}
      variant="menu-toggle"
      aria-label="Open information"
      aria-haspopup="dialog"
      aria-expanded={isOpen("info")}
      aria-controls="info"
    >
      <InfoIcon className="size-7/10" />
    </Button>
  );
};

export default InfoButton;
