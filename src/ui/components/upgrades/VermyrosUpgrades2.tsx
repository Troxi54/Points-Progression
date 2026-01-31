import vermyrosUpgrades from "@/game/upgrades/containers/vermyros";
import UpgradeContainer from "../base/UpgradeContainer";

function VermyrosUpgrades2() {
  return (
    <UpgradeContainer upgradeContainer={vermyrosUpgrades} start={5} end={8} />
  );
}

export default VermyrosUpgrades2;
