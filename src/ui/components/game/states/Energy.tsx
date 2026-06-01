import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import Currency from "@ui/components/features/Currency";
import NexusSign from "@ui/components/features/NexusSign";

function Energy() {
  return (
    <Currency
      currencyId="energy"
      containerClassName="bg-energy-bg"
      textClassName="text-energy"
      effectClassName="text-energy-effect"
      playerSelector={(state) => hasNexusLevelSelection(state, 12, "12")}
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "energy", "points"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 12),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "energy", "xagoraDertoints")}{" "}
              <NexusSign level={12} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Energy;
