import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function DarkEnergy() {
  return (
    <CurrencyComponent
      currencyId="darkEnergy"
      containerClassName="bg-dark-energy-bg"
      textClassName="dark-energy"
      effectClassName="text-dark-energy-effect text-shadow-none"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "darkEnergy", "energyReactors"),
        },
      ]}
    />
  );
}

export default DarkEnergy;
