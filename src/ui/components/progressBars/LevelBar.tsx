import ResetLayerProgressBar from "@/ui/components/base/ResetLayerProgressBar";
import { formatEffectForCurrency } from "@/core/format/effect";
import { integerCommaFormat } from "@/core/format/number";

function LevelBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="level"
      progressFillClassName="bg-level-bar"
      labelParts={({ cachedPlayer }) => {
        return [
          <>
            Level: {integerCommaFormat(cachedPlayer.level)} -{" "}
            <span className="text-level-effect">
              Effect:{" "}
              {formatEffectForCurrency(
                cachedPlayer.levelDertointEffect,
                "dertoints"
              )}
            </span>
          </>
        ];
      }}
    />
  );
}

export default LevelBar;
