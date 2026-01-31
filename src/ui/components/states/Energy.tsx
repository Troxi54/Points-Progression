import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function Energy() {
  return (
    <CurrencyComponent
      currencyId="energy"
      containerClassName="bg-energy-bg"
      textClassName="text-energy"
      effectClassName="text-energy-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "energy", "points")
        }
      ]}
    />
  );
}

export default Energy;
