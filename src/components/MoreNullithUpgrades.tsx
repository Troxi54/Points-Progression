import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "@/upgrades";

function MoreNullithUpgrades() {
  return (
    <UpgradeContainer
      id="more-nullith-upgrades"
      upgrades={upgrades.moreNullithUpgrades}
      classNames="gap-[5%]"
    />
  );
}

export default MoreNullithUpgrades;
