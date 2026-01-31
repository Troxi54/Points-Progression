import { calculateTimeForRequirement } from "@/core/utils/time";
import { formatNumber, integerFormat } from "@/core/format/number";
import { formatLeftTime } from "@/core/format/time";
import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { getCachedCurrencyPropSelection } from "@/game/currencies/utils/selector";
import { toggleAmplivault } from "@/game/features/amplivault/utils";
import cn from "@/core/utils/tailwind";
import { formatEffectForCurrency } from "@/core/format/effect";

function Amplivault() {
  const state = usePlayerFields(
    {
      player: [
        "enteredAmplivault",
        "amplivaultLevel",
        "amplivaultBroken",
        "points",
      ],
      cachedPlayer: ["amplivaultRequirement", "amplivaultEffect"],
    },
    {
      additionalSelectors: (state) =>
        getCachedCurrencyPropSelection(state, "points", "gain"),
      useFormat: true,
    },
  );

  const animationPaused = !(state.enteredAmplivault || state.amplivaultBroken);
  const animationStateClassname = animationPaused ? "paused" : "";

  const leftTime = calculateTimeForRequirement(
    state.points,
    state.cachedCurrency_points_gain,
    state.amplivaultRequirement,
  );

  return (
    <button
      className={cn(
        "flex items-center flex-col w-full",
        state.amplivaultBroken
          ? cn(
              "[background-image:var(--broken-amplivault-gradient-bg)]",
              "border-image-gradient",
              "[border-image-source:var(--broken-amplivault-gradient-bg)]",
              "hover:[border-image-source:var(--broken-amplivault-gradient)]",
            )
          : "bg-amplivault-bg hover:border-amplivault",
      )}
      onClick={toggleAmplivault}
      aria-label="Enter Amplivault"
    >
      <div
        className={cn(
          "relative w-20 h-20 border-2 border-amplivault-div-border",
          state.amplivaultBroken
            ? cn(
                "bg-black border-image-gradient",
                "shadow-[0_0_0.5em_0.1em_rgba(0,0,0,0.5)]",
                "before-full before:z-1 before:opacity-85",
                "[border-image-source:var(--broken-amplivault-gradient)]",
                "before:[background-image:var(--broken-amplivault-gradient-bg)]",
              )
            : "bg-amplivault-div-bg",
        )}
      >
        <div className="absolute-full bg-amplivault-div-2-bg border-2 border-amplivault-div-2-border rounded-full"></div>
        <div
          id="amplivault-line-container"
          className={cn(
            "relative w-[calc(100%/1.4142-2px)] aspect-square bg-amplivault-div-3-bg border-2 border-amplivault-div-3-border",
            "animate-[amplivault-animation_linear_infinite]",
            state.amplivaultBroken
              ? "[animation-duration:2.74s]"
              : "[animation-duration:1.5s]",
            animationStateClassname,
          )}
        >
          <div className={animationStateClassname}></div>
          <div className={cn(animationStateClassname, "rotate-90")}></div>
        </div>
      </div>
      <p
        className={
          state.amplivaultBroken ? "broken-amplivault" : "text-amplivault-info"
        }
      >
        {state.amplivaultBroken ? (
          <>
            Broken Amplivault -{" "}
            <span className="tracking-wider font-normal">
              You need to reach the requirement to increase your Amplivault
              level. Amplivault level boosts Ampliflux.
            </span>
          </>
        ) : (
          <>
            Amplivault -{" "}
            <span className={"text-amplivault-description"}>
              Entering Amplivault triggers a Vermyros reset. While inside, you
              can't buy Point Upgrade, and you need to reach the requirement to
              increase your Amplivault Level. Amplivault Level boosts Ampliflux.
            </span>
          </>
        )}
        <br />
        <br />
        Amplivault level: {integerFormat(state.amplivaultLevel)}, for the next
        one: {formatNumber(state.amplivaultRequirement)}
        {(state.enteredAmplivault || state.amplivaultBroken) && (
          <>
            {" "}
            -{" "}
            <span className="text-amplivault-description">
              {formatLeftTime(leftTime)}
            </span>
          </>
        )}
        {state.amplivaultLevel.greaterThan(0) && (
          <>
            <br />
            <span className="text-amplivault-description">
              Effect:{" "}
              {formatEffectForCurrency(state.amplivaultEffect, "ampliflux")}
            </span>
          </>
        )}
      </p>
    </button>
  );
}

export default Amplivault;
