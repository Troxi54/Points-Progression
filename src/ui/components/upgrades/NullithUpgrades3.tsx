import UpgradeContainer from "@/ui/components/base/UpgradeContainer";
import nullithUpgrades from "@/game/upgrades/containers/nullith";

function NullithUpgrades3() {
  return (
    <UpgradeContainer upgradeContainer={nullithUpgrades} start={7} end={8} />
  );
}

export default NullithUpgrades3;
