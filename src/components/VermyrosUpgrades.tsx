
import { upgrades } from "../Upgrades";
import UpgradeContainer from "./UpgradeContainer";

function VermyrosUpgrades() {
  return (
    <UpgradeContainer id="vermyros-upgrades" upgrades={upgrades.vermyrosUpgrades} classNames="gap-[5%]"/>
  );
}

export default VermyrosUpgrades;