import { formatCurrencyEffect } from "@game/currencies/utils/format";
import Currency from "@ui/components/features/Currency";

function Amplivoid() {
  return (
    <Currency
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
