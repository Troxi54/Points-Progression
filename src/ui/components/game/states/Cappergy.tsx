import { formatNumber } from "@core/format/number";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import cappergyConfig from "@game/features/cappergy/config";
import Currency from "@ui/components/features/Currency";

function Cappergy() {
  return (
    <Currency
      currencyId="cappergy"
      containerClassName="text-xl [background-image:var(--cappergy-bg-gradient)] "
      mainTextClassName="cappergy"
      effectClassName="cappergy-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "cappergy", "dertoints")}{" "}
              after {formatNumber(cappergyConfig.startsWorkingFrom)}
            </>
          ),
        },
      ]}
    ></Currency>
  );
}

export default Cappergy;
