import { hasUpgradeById } from "@game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@game/upgrades/utils/selector";
import AutoResetToggle from "@ui/components/features/AutoResetToggle";
import StatusText from "@ui/components/base/StatusText";

function AutoTierButton() {
  return (
    <AutoResetToggle
      resetLayerId="tier"
      playerSelector={({ mergedPlayer }) =>
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
