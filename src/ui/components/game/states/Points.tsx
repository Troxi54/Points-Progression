import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import Currency from "@ui/components/features/Currency";
import NexusSign from "@ui/components/features/NexusSign";

function Points() {
  return (
    <Currency
      currencyId="points"
      playerSelector={(state) => hasNexusLevelSelection(state, 1, "1")}
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
