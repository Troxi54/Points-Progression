import { formatCurrencyEffect } from "@game/currencies/utils/format";
import Currency from "@ui/components/features/Currency";

function DarkEnergy() {
  return (
    <Currency
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
