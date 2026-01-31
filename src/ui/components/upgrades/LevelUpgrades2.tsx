import UpgradeContainer from "@/ui/components/base/UpgradeContainer";
import levelUpgrades from "@/game/upgrades/containers/level";

function LevelUpgrades2() {
  return <UpgradeContainer upgradeContainer={levelUpgrades} start={5} />;
}

export default LevelUpgrades2;
