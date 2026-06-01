import infoIcon from "@ui/assets/info.svg";
import Button from "@ui/components/base/Button";
import Image from "@ui/components/base/Image";
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
      <Image src={infoIcon} alt="" className="h-6/11" />
    </Button>
  );
};

export default InfoButton;
