import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function EnergyReactors() {
  return (
    <CurrencyComponent
      currencyId="energyReactors"
      containerClassName="bg-energy-reactor-bg"
      textClassName="text-energy-reactor"
      effectClassName="text-energy-reactor-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "energyReactors", "energy")
        }
      ]}
    />
  );
}

export default EnergyReactors;
