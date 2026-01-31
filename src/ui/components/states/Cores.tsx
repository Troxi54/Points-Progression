import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function Cores() {
  return (
    <CurrencyComponent
      currencyId="cores"
      containerClassName="bg-core-bg"
      textClassName="core"
      effectClassName="text-core-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "cores", "energyReactors")
        }
      ]}
    />
  );
}

export default Cores;
