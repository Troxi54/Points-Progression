import CurrencyComponent from "@ui/components/base/Currency";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import NexusSign from "../base/NexusSign";

function Points() {
  return (
    <CurrencyComponent
      currencyId="points"
      usePlayerSelector={(state) => hasNexusLevelSelection(state, 1, "1")}
      effectNodes={[
        {
          works: ({ player }) => hasNexusLevel(player, 1),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(
                cachedPlayer,
                "points",
                "madeNullithResets",
              )}{" "}
              <NexusSign level={1} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Points;
