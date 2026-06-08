import { currencyEffectWorks } from "@game/currencies/utils/calculate";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import Currency from "@ui/components/features/Currency";

function AntiPoints() {
  return (
    <Currency
      currencyId="antiPoints"
      containerClassName="bg-anti-points-bg shadow-[0_0_10px_5px_rgba(0,0,0,.5)]"
      effectNodes={[
        {
          works: (mergedPlayer) =>
            currencyEffectWorks(mergedPlayer, "antiPoints", "points"),
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "antiPoints", "points"),
        },
        {
          works: (mergedPlayer) =>
            currencyEffectWorks(mergedPlayer, "antiPoints", "beneflux"),
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "antiPoints", "beneflux"),
        },
      ]}
    />
  );
}

export default AntiPoints;
