import CurrencyComponent from "@/ui/components/base/Currency";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import { hasNexusLevel } from "@/game/features/nexus/utils/has";

function Vermora() {
  return (
    <CurrencyComponent
      currencyId="vermora"
      effectClassName="text-vermyros-effect"
      effectNodes={[
        {
          node: ({ cachedPlayer }) =>
            formatCurrencyEffect(cachedPlayer, "vermora", "ampliflux"),
        },
        {
          works: ({ player }) => hasNexusLevel(player, 8),
          node: ({ cachedPlayer }) => (
            <>
              {formatCurrencyEffect(cachedPlayer, "vermora", "amplivoid")}{" "}
              <span className="text-(--nexus-milestone-8)">(N8)</span>
            </>
          ),
        },
      ]}
    />
  );
}

export default Vermora;
