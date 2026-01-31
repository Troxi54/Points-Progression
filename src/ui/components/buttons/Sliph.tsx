import { isDimension } from "@/game/dimensions/utils/compare";
import { toggleSliph } from "@/game/features/sliph/utils";
import { usePlayerFields } from "@/ui/hooks/usePlayer";
import cn from "@/core/utils/tailwind";

function Sliph() {
  const state = usePlayerFields({
    player: ["dimensionId"],
  });

  const isSliph = isDimension(state.dimensionId, "sliph");

  return (
    <button
      className={cn(
        "[background-image:var(--sliph-gradient-bg)]",
        "border-image-gradient [border-image-source:var(--sliph-gradient-bg)] hover:[border-image-source:var(--sliph-gradient)]",
      )}
      onClick={toggleSliph}
      aria-label="Toggle Sliph"
    >
      <p>
        <span className="sliph">Sliph - </span>
        <span className="sliph-description">
          {isSliph ? "exit" : "enter"} the more challenging dimension. Only one
          dimension can be active at a time
        </span>
      </p>
    </button>
  );
}

export default Sliph;
