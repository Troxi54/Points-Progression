import { format } from "@/format";
import { usePlayer } from "@player/playerStore";
import { settings } from "@player/settings";

function Softcapper() {
  const { softcapperLevel, bestSoftcapperLevel } = usePlayer((state) => ({
    softcapperLevel: state.cachedPlayer.softcapperLevel,
    bestSoftcapperLevel: state.player.bestSoftcapperLevel
  }));

  const softcappers = [];
  for (const [index, softcapper] of settings.softcappers.entries()) {
    if (bestSoftcapperLevel.lessThan(index + 1)) break;
    softcappers.push(softcapper);
  }

  return (
    <div className="flex-col bg-linear-to-r from-softcapper-bg-1 to-softcapper-bg-2">
      <h2 className="text-gradient bg-linear-to-l from-softcapper-h-1 to-softcapper-h-2 text-[2em] mb-[.4em]">
        Softcapper
      </h2>
      <div className="softcap-container flex-col gap-y-2">
        {softcappers.map((softcapper, i) => {
          const index = i + 1;
          return (
            <p className={"softcap-" + index} key={index}>
              Level {index}: at {format(softcapper[0])} - ^
              {format(softcapper[1])} point gain
              {softcapperLevel.greaterThanOrEqualTo(index) && " (Active)"}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default Softcapper;
