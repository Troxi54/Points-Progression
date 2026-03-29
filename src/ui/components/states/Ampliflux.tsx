import CurrencyComponent from "@ui/components/base/Currency";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import NexusSign from "../base/NexusSign";

function Ampliflux() {
  return (
    <CurrencyComponent
      currencyId="ampliflux"
      containerClassName="bg-ampliflux-bg"
      textClassName="text-ampliflux"
      effectClassName="text-ampliflux-effect"
      usePlayerSelector={(state) => hasNexusLevelSelection(state, 6, "6")}
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "ampliflux", "points"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 6),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "ampliflux", "madeTierTimes")}{" "}
              <NexusSign level={6} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Ampliflux;
