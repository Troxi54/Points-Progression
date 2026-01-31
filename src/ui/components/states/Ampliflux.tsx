import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

function Ampliflux() {
  return (
    <CurrencyComponent
      currencyId="ampliflux"
      containerClassName="bg-ampliflux-bg"
      textClassName="text-ampliflux"
      effectClassName="text-ampliflux-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "ampliflux", "points")
        },
        {
          works: ({ player }) => hasNexusLevel(player, 6),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "ampliflux", "madeTierTimes")}{" "}
              <span className="text-(--nexus-milestone-6)">(N6)</span>
            </>
          )
        }
      ]}
    />
  );
}

export default Ampliflux;
