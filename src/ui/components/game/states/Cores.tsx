import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import CurrencyComponent from "@ui/components/base/Currency";
import NexusSign from "../features/NexusSign";

function Cores() {
  return (
    <CurrencyComponent
      currencyId="cores"
      containerClassName="bg-core-bg"
      textClassName="core"
      effectClassName="text-core-effect"
      playerSelector={(state) => hasNexusLevelSelection(state, 13, "13")}
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "cores", "energyReactors"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 13),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "cores", "score")}{" "}
              <NexusSign level={13} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Cores;
