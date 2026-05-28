import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import CurrencyComponent from "@ui/components/base/Currency";
import NexusSign from "../features/NexusSign";

function Vermora() {
  return (
    <CurrencyComponent
      currencyId="vermora"
      effectClassName="text-vermyros-effect"
      playerSelector={(state) => hasNexusLevelSelection(state, 8, "8")}
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "vermora", "ampliflux"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 8),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "vermora", "amplivoid")}{" "}
              <NexusSign level={8} />
            </>
          ),
        },
      ]}
    />
  );
}

export default Vermora;
