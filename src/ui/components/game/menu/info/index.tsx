import infoIcon from "@ui/assets/info.svg";
import Image from "@ui/components/base/Image";
import { useMenu } from "@ui/hooks/useMenu";

const InfoButton = () => {
  const { open } = useMenu();

  return (
    <button onClick={() => open("info")} aria-label="Open info">
      <Image src={infoIcon} name="Information" className="h-6/11" />
    </button>
  );
};

export default InfoButton;
