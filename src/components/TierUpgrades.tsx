import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../upgrades";

function TierUpgrades() {
  return (
    <UpgradeContainer
      id="tier-upgrades"
      upgrades={upgrades.tierUpgrades}
      classNames="gap-[5%]"
    />
  );
}

export default TierUpgrades;
