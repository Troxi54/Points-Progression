import UpgradeContainer from "@/ui/components/base/UpgradeContainer";
import resetUpgrades from "@/game/upgrades/containers/reset";

function ResetUpgrades() {
  return <UpgradeContainer upgradeContainer={resetUpgrades} />;
}

export default ResetUpgrades;
