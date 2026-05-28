import tierUpgrades from "@game/upgrades/containers/tier";
import UpgradeContainer from "../features/UpgradeContainer";

function TierUpgrades() {
  return <UpgradeContainer upgradeContainer={tierUpgrades} end={4} />;
}

export default TierUpgrades;
