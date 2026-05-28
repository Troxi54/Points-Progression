import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import CurrencyComponent from "@ui/components/base/Currency";
import NexusSign from "@ui/components/features/NexusSign";

function EnergyReactors() {
  return (
    <CurrencyComponent
      currencyId="energyReactors"
      containerClassName="bg-energy-reactor-bg"
      textClassName="text-energy-reactor"
      effectClassName="text-energy-reactor-effect"
      playerSelector={(state) => hasNexusLevelSelection(state, 11, "11")}
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "energyReactors", "energy"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 11),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "energyReactors", "cores")}{" "}
              <NexusSign level={11} />
            </>
          ),
        },
      ]}
    />
  );
}

export default EnergyReactors;
