import CurrencyComponent from "@ui/components/base/Currency";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import NexusSign from "../base/NexusSign";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";

function Energy() {
  return (
    <CurrencyComponent
      currencyId="energy"
      containerClassName="bg-energy-bg"
      textClassName="text-energy"
      effectClassName="text-energy-effect"
      usePlayerSelector={(state) => hasNexusLevelSelection(state, 12, "12")}
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
