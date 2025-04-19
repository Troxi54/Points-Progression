import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../Upgrades";

function MoreVermyrosUpgrades() {
  return (
    <UpgradeContainer id="more-vermyros-upgrades" upgrades={upgrades.moreVermyrosUpgrades} classNames="gap-[5%]"/>
  );
}

export default MoreVermyrosUpgrades;