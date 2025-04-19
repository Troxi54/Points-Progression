import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../Upgrades";

function ResetUpgrades() {
  return (
    <UpgradeContainer id="reset-upgrades" upgrades={upgrades.resetUpgrades} classNames="gap-[10%]"/>
  );
}

export default ResetUpgrades;