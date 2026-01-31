import tierUpgrades from "@/game/upgrades/containers/tier";
import UpgradeContainer from "../base/UpgradeContainer";

function TierUpgrades() {
  return <UpgradeContainer upgradeContainer={tierUpgrades} end={4} />;
}

export default TierUpgrades;
