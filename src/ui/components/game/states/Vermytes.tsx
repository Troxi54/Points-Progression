import { mergeObjects } from "@core/utils/object";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@game/upgrades/utils/selector";
import Currency from "@ui/components/features/Currency";
import NexusSign from "@ui/components/features/NexusSign";

function Vermytes() {
  return (
    <Currency
      currencyId="vermytes"
      playerSelector={({ mergedPlayer }) =>
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
