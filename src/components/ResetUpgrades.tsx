import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "../upgrades";

function ResetUpgrades() {
  return (
    <UpgradeContainer
      id="reset-upgrades"
      upgrades={upgrades.resetUpgrades}
      classNames="gap-[10%]"
    />
  );
}

export default ResetUpgrades;
