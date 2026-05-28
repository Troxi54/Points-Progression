import levelUpgrades from "@game/upgrades/containers/level";
import UpgradeContainer from "@ui/components/features/UpgradeContainer";

function LevelUpgrades() {
  return <UpgradeContainer upgradeContainer={levelUpgrades} end={4} />;
}

export default LevelUpgrades;
