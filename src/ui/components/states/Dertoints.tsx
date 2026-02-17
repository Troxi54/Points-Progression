import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";

function Dertoints() {
  return (
    <CurrencyComponent
      currencyId="dertoints"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "dertoints", "darkEnergy"),
        },
      ]}
    />
  );
}

export default Dertoints;
