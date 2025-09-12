import UpgradeContainer from "./UpgradeContainer";
import { upgrades } from "@/upgrades";

function MoreVermyrosUpgrades2() {
  return (
    <UpgradeContainer
      id="more-vermyros-upgrades-2"
      upgrades={upgrades.moreVermyrosUpgrades2}
      classNames="gap-[10%]"
    />
  );
}

export default MoreVermyrosUpgrades2;
