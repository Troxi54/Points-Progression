import CurrencyComponent from "@ui/components/base/Currency";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import NexusSign from "../base/NexusSign";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";

function EnergyReactors() {
  return (
    <CurrencyComponent
      currencyId="energyReactors"
      containerClassName="bg-energy-reactor-bg"
      textClassName="text-energy-reactor"
      effectClassName="text-energy-reactor-effect"
      usePlayerSelector={(state) => hasNexusLevelSelection(state, 11, "11")}
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
