import { upgrades } from "@/upgrades";
import UpgradeContainer from "./UpgradeContainer";

function DertointUpgrades() {
  return (
    <UpgradeContainer
      id="dertoint-upgrades"
      upgrades={upgrades.dertointUpgrades}
      classNames="gap-[5%]"
    />
  );
}

export default DertointUpgrades;
