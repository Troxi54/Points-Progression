import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function Amplivoid() {
  return (
    <CurrencyComponent
      currencyId="amplivoid"
      containerClassName="bg-amplivoid-bg"
      textClassName="text-amplivoid"
      effectClassName="text-amplivoid-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "amplivoid", "ampliflux"),
        },
      ]}
    />
  );
}

export default Amplivoid;
