import UpgradeContainer from "@/ui/components/base/UpgradeContainer";
import levelUpgrades from "@/game/upgrades/containers/level";

function LevelUpgrades() {
  return <UpgradeContainer upgradeContainer={levelUpgrades} end={4} />;
}

export default LevelUpgrades;
