import Pow from "@/ui/components/base/Pow";
import { formatNumber } from "@/core/format/number";
import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { getPlayerState } from "@/game/player/store/store";
import { parseValueGetter } from "@/game/player/utils";
import softcapperData from "@/game/softcappers/data";

function Softcapper() {
  const state = usePlayerFields(
    {
      player: ["bestSoftcapperLevel"],
      cachedPlayer: ["softcapperLevel"]
    },
    {
      useFormat: true
    }
  );

  const pointSoftcappers = softcapperData.points;
  if (!pointSoftcappers) return null;

  const softcappers = [];
  for (const [index, softcapper] of pointSoftcappers.entries()) {
    if (state.bestSoftcapperLevel.lessThan(index + 1)) break;
    softcappers.push(softcapper);
  }

  const { mergedPlayer } = getPlayerState();

  return (
    <div className="flex-col bg-linear-to-r from-softcapper-bg-1 to-softcapper-bg-2">
      <h2 className="text-gradient bg-linear-to-l from-softcapper-header-1 to-softcapper-header-2 text-[2em] mb-[.4em]">
        Softcapper
      </h2>
      <div className="softcap-container flex-col gap-y-2">
        {softcappers.map((softcapper, i) => {
          const index = i + 1;

          const mode = softcapper.mode;

          const power = parseValueGetter(softcapper.power, mergedPlayer);
          const startsAt = parseValueGetter(softcapper.startsAt, mergedPlayer);

          const formattedPower = formatNumber(power);

          return (
            <p className={"softcap-" + index} key={index}>
              Level {index}: at {formatNumber(startsAt)} -{" "}
              {mode === "pow" ? (
                <>
                  Points<Pow>{formattedPower}</Pow>
                </>
              ) : (
                `${formattedPower}x`
              )}{" "}
              {state.softcapperLevel.greaterThanOrEqualTo(index) && " (Active)"}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default Softcapper;
