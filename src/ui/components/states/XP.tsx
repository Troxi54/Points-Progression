import CurrencyComponent from "@/ui/components/base/Currency";
import ProgressBar from "@/ui/components/base/ProgressBar";
import { formatCurrency } from "@/game/currencies/utils/format";
import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { calculateProgress } from "@/core/utils/progress";

function XPState() {
  const { XP, XPForThisLevel, XPForNextLevel } = usePlayerFields({
    player: ["XP"],
    cachedPlayer: ["XPForThisLevel", "XPForNextLevel"],
  });

  const progress = calculateProgress(
    XP.minus(XPForThisLevel),
    XPForNextLevel.minus(XPForThisLevel),
  );

  return (
    <ProgressBar progress={progress} progressFillClassName="bg-xp-bar">
      <CurrencyComponent
        currencyId="XP"
        passiveGainPriority={false}
        preEffectChildren={() => (
          <>
            {" - "}
            <span className="text-text-muted">
              For next level:{" "}
              <span className="text-level-effect">
                {formatCurrency(XPForNextLevel, "XP")}
              </span>
            </span>
          </>
        )}
      />
    </ProgressBar>
  );
}

export default XPState;
