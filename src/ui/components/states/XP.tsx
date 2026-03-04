import { formatCurrency } from "@game/currencies/utils/format";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { calculateProgress } from "@core/utils/progress";
import { formatLeftTime } from "@core/format/time";
import { calculateTimeForRequirement } from "@core/utils/time";
import { getCachedCurrencyPropSelection } from "@game/currencies/utils/selector";
import ProgressBar from "../base/ProgressBar";
import CurrencyContent from "../base/CurrencyContent";

function XPState() {
  const { XP, cachedCurrency_XP_gain, XPForThisLevel, XPForNextLevel } =
    usePlayerFields(
      {
        player: ["XP"],
        cachedPlayer: ["XPForThisLevel", "XPForNextLevel"],
      },
      {
        useFormat: true,
        additionalSelectors: ({ mergedPlayer }) =>
          getCachedCurrencyPropSelection(mergedPlayer, "XP", "gain"),
      },
    );

  const progress = calculateProgress(
    XP.minus(XPForThisLevel),
    XPForNextLevel.minus(XPForThisLevel),
  );

  const leftTime = calculateTimeForRequirement(
    XP,
    cachedCurrency_XP_gain,
    XPForNextLevel,
  );

  return (
    <ProgressBar
      progress={progress}
      progressFillClassName="bg-xp-bar"
      labelParts={[
        <CurrencyContent currencyId="XP" />,
        <span className="text-text-muted">
          For next level:{" "}
          <span className="text-level-effect">
            {formatCurrency(XPForNextLevel, "XP")}
          </span>{" "}
          - {formatLeftTime(leftTime)}
        </span>,
      ]}
    ></ProgressBar>
  );
}

export default XPState;
