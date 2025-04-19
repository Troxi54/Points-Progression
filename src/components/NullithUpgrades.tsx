import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../Upgrades";

function NullithUpgrades() {
  return (
    <UpgradeContainer id="nullith-upgrades" upgrades={upgrades.nullithUpgrades} classNames="gap-[5%]"/>
  );
}

export default NullithUpgrades;