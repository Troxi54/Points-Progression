import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import { hasUpgradeSelectionById } from "@game/upgrades/utils/selector";
import CurrencyContent from "@ui/components/base/CurrencyContent";
import ResetLayerProgressBar from "@ui/components/features/ResetLayer";

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
            playerSelector={(state) =>
              hasUpgradeSelectionById(state, "level_6")
            }
            passiveGainPriority={({ player }) =>
              hasUpgradeById(player, "level_6")
            }
            effectNodes={[
              {
                node: ({ cachedPlayer }) =>
                  formatCurrencyEffect(
                    cachedPlayer,
                    "mallirtTotalDertoints",
                    "dertoints",
                  ),
              },
            ]}
          />,
        ];
      }}
    />
  );
}

export default MallirtBar;
