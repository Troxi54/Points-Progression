import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@/game/upgrades/utils/selector";

function Vermytes() {
  return (
    <CurrencyComponent
      currencyId="vermytes"
      usePlayerSelector={({ mergedPlayer }) =>
        hasUpgradeSelectionById(mergedPlayer, "vermyros_8")
      }
      effectClassName="text-vermyros-effect"
      effectNodes={[
        {
          works: ({ player }) => hasNexusLevel(player, 9),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "vermytes", "score")}{" "}
              <span className="text-(--nexus-milestone-9)">(N9)</span>
            </>
          ),
        },
      ]}
      passiveGainPriority={({ player }) => hasUpgradeById(player, "vermyros_8")}
    />
  );
}

export default Vermytes;
