import { calculateTimeForRequirement } from "@utils/timeUtils";
import { format, formatLeftTime, formatWithPlural } from "@/format";
import { usePlayer } from "@player/playerStore";
import { toggleAmplivault } from "@/playerActions";

function Amplivault() {
  const {
    enteredAmplivault,
    amplivaultLevel,
    amplivaultRequirement,
    amplivaultEffect,
    amplivaultBroken,
    points,
    pointGain
  } = usePlayer((state) => ({
    enteredAmplivault: state.player.enteredAmplivault,
    amplivaultLevel: state.player.amplivaultLevel,
    amplivaultRequirement: state.cachedPlayer.amplivaultRequirement,
    amplivaultEffect: state.cachedPlayer.amplivaultEffect,
    amplivaultBroken: state.player.amplivaultBroken,
    points: state.player.points,
    pointGain: state.cachedPlayer.pointGain
  }));

  const animationPaused = !(enteredAmplivault || amplivaultBroken);
  const animationStyle = {
    animationPlayState: animationPaused ? "paused" : ""
  };
  const leftTime = calculateTimeForRequirement(
    points,
    pointGain,
    amplivaultRequirement
  );

  const brokenButtonStyle = `[background-image:var(--broken-amplivault-gradient-bg)] border-image-gradient [border-image-source:var(--broken-amplivault-gradient-bg)] hover:[border-image-source:var(--broken-amplivault-gradient-border)]`;

  return (
    <button
      className={
        "flex items-center flex-col w-full " +
        (amplivaultBroken
          ? brokenButtonStyle
          : "bg-amplivault-bg hover:border-amplivault-hover-border")
      }
      onClick={toggleAmplivault}
      aria-label="Enter Amplivault"
    >
      <div
        className={
          "relative w-20 h-20 border-2 border-amplivault-div-border " +
          (amplivaultBroken
            ? "border-image-gradient [border-image-source:var(--broken-amplivault-gradient-border)] bg-black before-full before:z-1 before:[background-image:var(--broken-amplivault-gradient-bg)] before:opacity-85 shadow-[0_0_0.5em_0.1em_rgba(0,0,0,0.5)]"
            : "bg-amplivault-div-bg")
        }
      >
        <div className="absolute size-full bg-amplivault-div-2-bg border-2 border-amplivault-div-2-border rounded-full"></div>
        <div
          id="amplivault-line-container"
          className={
            "relative w-[calc(100%/1.4142-2px)] aspect-square bg-amplivault-div-3-bg border-2 border-amplivault-div-3-border" +
            (amplivaultBroken
              ? " animate-[amplivault-animation_2.74s_linear_infinite]"
              : " animate-[amplivault-animation_1.5s_linear_infinite]")
          }
          style={animationStyle}
        >
          <div className={animationStyle.animationPlayState}></div>
          <div className={animationStyle.animationPlayState}></div>
        </div>
      </div>
      <p
        className={
          amplivaultBroken ? "broken-amplivault" : "text-amplivault-info"
        }
      >
        {amplivaultBroken ? (
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
              Entering the Amplivault triggers a Vermyros reset. While inside,
              you can't buy the Upgrade, and you need to reach the requirement
              to increase your Amplivault Level. Amplivault Level boosts
              Ampliflux.
            </span>
          </>
        )}
        <br />
        <br />
        Amplivault level: {format(amplivaultLevel, 0)}, for the next one:{" "}
        {format(amplivaultRequirement)}
        {(enteredAmplivault || amplivaultBroken) && (
          <>
            {" "}
            -{" "}
            <span className="text-amplivault-description">
              {formatLeftTime(leftTime)}
            </span>
          </>
        )}
        {amplivaultLevel.greaterThan(0) && (
          <>
            <br />
            <span className="text-amplivault-description">
              Effect: {formatWithPlural(amplivaultEffect, "Ampliflux", "x ")}
            </span>
          </>
        )}
      </p>
    </button>
  );
}

export default Amplivault;
