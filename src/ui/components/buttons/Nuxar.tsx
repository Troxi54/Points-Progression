import CurrencyContent from "@/ui/components/base/CurrencyContent";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import nuxarConfig from "@/game/features/nuxar/config";
import { triggerNuxar } from "@/game/features/nuxar/utils";
import { formatNumber } from "@/core/format/number";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import { toPercentage } from "@/core/utils/decimal";
import cn from "@/core/utils/tailwind";

function Nuxar() {
  usePlayer(() => null, {
    useFormat: true,
  });

  return (
    <button
      className={cn(
        "[background-image:var(--nuxar-gradient-bg)]",
        "border-image-gradient [border-image-source:var(--nuxar-gradient-bg)]",
        "hover:[border-image-source:var(--nuxar-gradient-border)]",
      )}
      onClick={triggerNuxar}
      aria-label="Trigger Nuxar"
    >
      <p>
        <span className="nuxar">Nuxar - </span>
        <span className="nuxar-description">
          convert {toPercentage(nuxarConfig.nullionLoss)} of Nullions into Nux
          that boost Nullith Resets. You need to have at least{" "}
          {formatNumber(nuxarConfig.requirement)} Nullions
        </span>
        <br />
        <br />
        <CurrencyContent
          currencyId="nux"
          mainTextClassName="nuxar"
          effectClassName="nuxar-description"
          passiveGainPriority={false}
          effectNodes={[
            {
              node: ({ cachedPlayer }) =>
                formatCurrencyEffect(cachedPlayer, "nux", "madeNullithResets"),
            },
          ]}
        />
      </p>
    </button>
  );
}

export default Nuxar;
