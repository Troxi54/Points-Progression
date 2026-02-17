import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import cappergyConfig from "@/game/features/cappergy/config";
import { formatNumber } from "@/core/format/number";

function Cappergy() {
  return (
    <CurrencyComponent
      currencyId="cappergy"
      containerClassName="big [background-image:var(--cappergy-bg-gradient)] "
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
    ></CurrencyComponent>
  );
}

export default Cappergy;
