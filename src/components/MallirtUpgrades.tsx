import { upgrades } from "@/upgrades";
import UpgradeContainer from "./UpgradeContainer";

function MallirtUpgrades() {
  return (
    <UpgradeContainer
      id="mallirt-upgrades"
      upgrades={upgrades.mallirtUpgrades}
      classNames="gap-[5%]"
    />
  );
}

export default MallirtUpgrades;
