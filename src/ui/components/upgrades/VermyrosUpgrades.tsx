import UpgradeContainer from "../base/UpgradeContainer";
import vermyrosUpgrades from "@/game/upgrades/containers/vermyros";

function VermyrosUpgrades() {
  return <UpgradeContainer upgradeContainer={vermyrosUpgrades} end={4} />;
}

export default VermyrosUpgrades;
