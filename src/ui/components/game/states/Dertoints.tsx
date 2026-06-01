import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { everPerformed } from "@game/resetLayers/utils/get";
import Currency from "@ui/components/features/Currency";

function Dertoints() {
  return (
    <Currency
      currencyId="dertoints"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "dertoints", "darkEnergy"),
        },
        {
          works: ({ player }) => everPerformed(player, "xagyros"),
          className: "text-xagyros-effect",
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "dertoints", "xagoraDertoints"),
        },
      ]}
    />
  );
}

export default Dertoints;
