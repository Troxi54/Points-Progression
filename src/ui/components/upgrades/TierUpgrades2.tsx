import tierUpgrades from "@/game/upgrades/containers/tier";
import UpgradeContainer from "../base/UpgradeContainer";

function TierUpgrades2() {
  return <UpgradeContainer upgradeContainer={tierUpgrades} start={5} />;
}

export default TierUpgrades2;
