import levelUpgrades from "@game/upgrades/containers/level";
import UpgradeContainer from "@ui/components/features/UpgradeContainer";

function LevelUpgrades2() {
  return <UpgradeContainer upgradeContainer={levelUpgrades} start={5} />;
}

export default LevelUpgrades2;
