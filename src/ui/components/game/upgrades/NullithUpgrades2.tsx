import nullithUpgrades from "@game/upgrades/containers/nullith";
import UpgradeContainer from "../features/UpgradeContainer";

function NullithUpgrades2() {
  return (
    <UpgradeContainer upgradeContainer={nullithUpgrades} start={5} end={6} />
  );
}

export default NullithUpgrades2;
