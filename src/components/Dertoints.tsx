import { format, splittedFormatWithPlural } from "../format";
import { usePlayer } from "../player/playerStore";

function Dertoints() {
  const { dertoints, dertointGain, dertointEffect } = usePlayer((state) => ({
    dertoints: state.player.dertoints,
    dertointGain: state.cachedPlayer.dertointGain,
    dertointEffect: state.cachedPlayer.dertointEffect
  }));

  const splittedEffect = splittedFormatWithPlural(
    dertointEffect,
    "Dark Energy"
  );

  return (
    <div>
      <p>
        Dertoints: {format(dertoints)}
        {dertointGain.notEquals(0) && ` (+${format(dertointGain)}/s)`}
        {dertointEffect.greaterThan(1) && (
          <>
            {" "}
            -{" "}
            <span className="text-effect">
              Effect: x<sup>{splittedEffect[0]}</sup> {splittedEffect[1]}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default Dertoints;
