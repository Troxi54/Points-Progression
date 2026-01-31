import ResetLayerProgressBar from "@/ui/components/base/ResetLayerProgressBar";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import CurrencyContent from "@/ui/components/base/CurrencyContent";
import { hasUpgradeById } from "@/game/upgrades/utils/has";

function MallirtBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="mallirt"
      progressFillClassName="bg-mallirt-bar"
      labelParts={() => {
        return [
          <CurrencyContent
            currencyId="mallirtTotalDertoints"
            effectClassName="text-mallirt-effect"
            passiveGainPriority={({ player }) =>
              hasUpgradeById(player, "level_6")
            }
            effectNodes={[
              {
                node: ({ cachedPlayer }) =>
                  formatCurrencyEffect(
                    cachedPlayer,
                    "mallirtTotalDertoints",
                    "dertoints"
                  )
              }
            ]}
          />
        ];
      }}
    />
  );
}

export default MallirtBar;
