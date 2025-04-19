import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../Upgrades";

function MoreTierUpgrades() {
  return (
    <UpgradeContainer id="more-tier-upgrades" upgrades={upgrades.moreTierUpgrades} classNames="gap-[10%]"/>
  );
}

export default MoreTierUpgrades;