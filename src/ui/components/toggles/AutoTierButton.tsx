import AutoResetToggle from "@/ui/components/base/AutoResetToggle";
import StatusText from "@/ui/components/base/StatusText";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@/game/upgrades/utils/selector";

function AutoTierButton() {
  return (
    <AutoResetToggle
      resetLayerId="tier"
      usePlayerSelector={({ mergedPlayer }) =>
        hasUpgradeSelectionById(mergedPlayer, "vermyros_2")
      }
      customChildren={({ player }, enabled) => {
        const vermyros_2 = hasUpgradeById(player, "vermyros_2");
        const name = vermyros_2 ? "Tier Up" : "Tier";

        return (
          <>
            Auto {name}: <StatusText active={enabled}></StatusText>
          </>
        );
      }}
    />
  );
}

export default AutoTierButton;
