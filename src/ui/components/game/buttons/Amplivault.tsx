import { formatEffectOnCurrency } from "@core/format/effect";
import { formatNumber, integerFormat } from "@core/format/number";
import { formatLeftTime } from "@core/format/time";
import { mergeObjects } from "@core/utils/object";
import cn from "@core/utils/tailwind";
import { calculateTimeForRequirement } from "@core/utils/time";
import { getCachedCurrencyPropSelection } from "@game/currencies/utils/selector";
import { toggleAmplivault } from "@game/features/amplivault/utils";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import NexusSign from "../../features/NexusSign";
import Paragraph from "../../base/Paragraph";
import Button from "@ui/components/base/Button";
import Container from "@ui/components/base/Container";

function Amplivault() {
  const state = usePlayerFields(
    {
      player: [
        "enteredAmplivault",
        "amplivaultLevel",
        "amplivaultBroken",
        "points",
      ],
      cachedPlayer: [
        "amplivaultRequirement",
        "amplivaultEffect",
        "amplivaultAmplivoidEffect",
      ],
    },
    {
      additionalSelectors: (state) => {
        const pointGain = getCachedCurrencyPropSelection(
          state,
          "points",
          "gain",
        );
        const enoughNexusLevel = hasNexusLevelSelection(state, 10, "10");

        return mergeObjects(pointGain, enoughNexusLevel);
      },
      useFormat: true,
    },
  );

  const animationPaused = !(state.enteredAmplivault || state.amplivaultBroken);
  const animationStateClassname = animationPaused ? "paused" : "";
  const animationLineClassName =
    "absolute w-full h-[0.1em] bg-amplivault-div-4-bg after:content-[''] after:w-1/2 after:h-[0.2em] after:bg-amplivault-div-5-bg after:animate-[amplivault-line-animation_1.5s_linear_infinite]";

  const leftTime = calculateTimeForRequirement(
    state.points,
    state.cachedCurrency_points_gain,
    state.amplivaultRequirement,
  );

  const levelGreaterZero = state.amplivaultLevel.greaterThan(0);

  return (
    <Button
      className={cn(
        "flex w-full flex-col items-center",
        state.amplivaultBroken
          ? cn(
              "[background-image:var(--broken-amplivault-gradient-bg)]",
              "border-image-gradient [border-image-source:var(--broken-amplivault-gradient-bg)]",
              "hover:[border-image-source:var(--broken-amplivault-gradient)]",
            )
          : "bg-amplivault-bg hover:border-amplivault",
      )}
      onClick={toggleAmplivault}
      aria-label="Enter Amplivault"
    >
      <Container
        className={cn(
          "border-amplivault-div-border relative h-20 w-20 items-center border-2",
          state.amplivaultBroken
            ? cn(
                "border-image-gradient bg-black",
                "shadow-[0_0_0.5em_0.1em_rgba(0,0,0,0.5)]",
                "before:absolute before:inset-0 before:z-1 before:opacity-85",
                "[border-image-source:var(--broken-amplivault-gradient)]",
                "before:[background-image:var(--broken-amplivault-gradient-bg)]",
              )
            : "bg-amplivault-div-bg",
        )}
      >
        <Container className="bg-amplivault-div-2-bg border-amplivault-div-2-border absolute size-full rounded-full border-2" />
        <Container
          className={cn(
            "bg-amplivault-div-3-bg border-amplivault-div-3-border relative aspect-square w-[calc(100%/1.4142-2px)] animate-[amplivault-animation_linear_infinite] items-center border-2",
            state.amplivaultBroken
              ? "[animation-duration:2.74s]"
              : "[animation-duration:1.5s]",
            animationStateClassname,
          )}
        >
          <Container
            className={cn(animationLineClassName, animationStateClassname)}
          ></Container>
          <Container
            className={cn(
              animationLineClassName,
              animationStateClassname,
              "rotate-90",
            )}
          ></Container>
        </Container>
      </Container>

      {state.amplivaultBroken ? (
        <Paragraph className="broken-amplivault">
          Broken Amplivault -{" "}
          <span className="tracking-wider">
            You need to reach the requirement to increase your Amplivault level.
            Amplivault level boosts Ampliflux.
          </span>
          <br />
          <br />
          Amplivault level: {integerFormat(state.amplivaultLevel)}, for the next
          one: {formatNumber(state.amplivaultRequirement)}
          {(state.enteredAmplivault || state.amplivaultBroken) && (
            <> - {formatLeftTime(leftTime)}</>
          )}
          {levelGreaterZero && (
            <>
              <br />
              Effect:{" "}
              {formatEffectOnCurrency(state.amplivaultEffect, "ampliflux")}
              {state.hasNexusLevel10 && (
                <>
                  ,{" "}
                  {formatEffectOnCurrency(
                    state.amplivaultAmplivoidEffect,
                    "amplivoid",
                  )}{" "}
                  <NexusSign
                    className="cancel-text-gradient font-bold"
                    level={10}
                  />
                </>
              )}
            </>
          )}
        </Paragraph>
      ) : (
        <Paragraph className="text-amplivault-info">
          Amplivault -{" "}
          <span className={"text-amplivault-description"}>
            Entering Amplivault triggers a Vermyros reset. While inside, you
            can't buy Point Upgrade, and you need to reach the requirement to
            increase your Amplivault Level. Amplivault Level boosts Ampliflux.
          </span>
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
          {levelGreaterZero && (
            <>
              <br />
              <span className="text-amplivault-description">
                Effect:{" "}
                {formatEffectOnCurrency(state.amplivaultEffect, "ampliflux")}
                {state.hasNexusLevel10 && (
                  <>
                    ,{" "}
                    {formatEffectOnCurrency(
                      state.amplivaultAmplivoidEffect,
                      "amplivoid",
                    )}
                  </>
                )}
              </span>
              {state.hasNexusLevel10 && (
                <>
                  {" "}
                  <NexusSign level={10} />
                </>
              )}
            </>
          )}
        </Paragraph>
      )}
    </Button>
  );
}

export default Amplivault;
