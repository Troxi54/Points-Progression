import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

function Points() {
  return (
    <CurrencyComponent
      currencyId="points"
      effectNodes={[
        {
          works: ({ player }) => hasNexusLevel(player, 1),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(
                cachedPlayer,
                "points",
                "madeNullithResets"
              )}{" "}
              <span className="text-(--nexus-milestone-1)">(N1)</span>
            </>
          )
        }
      ]}
    />
  );
}

export default Points;
