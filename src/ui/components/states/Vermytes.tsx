import CurrencyComponent from "@ui/components/base/Currency";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@game/upgrades/utils/selector";
import { mergeObjects } from "@core/utils/object";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import NexusSign from "../base/NexusSign";

function Vermytes() {
  return (
    <CurrencyComponent
      currencyId="vermytes"
      usePlayerSelector={({ mergedPlayer }) =>
        mergeObjects(
          hasUpgradeSelectionById(mergedPlayer, "vermyros_8"),
          hasNexusLevelSelection(mergedPlayer, 9, "9"),
        )
      }
      passiveGainPriority={({ player }) => hasUpgradeById(player, "vermyros_8")}
      effectClassName="text-vermyros-effect"
      effectNodes={[
        {
          works: ({ player }) => hasNexusLevel(player, 9),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "vermytes", "score")}{" "}
              <NexusSign level={9} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Vermytes;
