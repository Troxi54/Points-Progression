import { formatNumber, integerCommaFormat } from "@core/format/number";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import softcapperData from "@game/softcappers/data";
import Container from "@ui/components/base/Container";
import Heading from "@ui/components/base/Heading";
import Paragraph from "@ui/components/base/Paragraph";
import Pow from "@ui/components/base/Pow";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function Softcapper() {
  const state = usePlayerFields(
    {
      player: ["bestSoftcapperLevel"],
      cachedPlayer: ["softcapperLevel"],
    },
    {
      useFormat: true,
    },
  );

  const pointSoftcappers = softcapperData.points;
  if (!pointSoftcappers) return null;

  const softcappers = [];
  for (const [index, softcapper] of pointSoftcappers.entries()) {
    if (state.bestSoftcapperLevel.lessThan(index + 1)) break;
    softcappers.push(softcapper);
  }

  const { mergedPlayer } = getPlayerState();

  const bestLvl = state.bestSoftcapperLevel.floor();
  const bestLvlNumber = bestLvl.toNumber();

  return (
    <Container
      className="flex-col"
      style={{
        backgroundImage: `var(--gradient-softcapper-level-${bestLvlNumber}-bg)`,
      }}
    >
      <Heading
        level={2}
        className="text-gradient mb-[.4em] text-[2em]"
        style={{
          backgroundImage: `var(--gradient-softcapper-level-${bestLvlNumber})`,
        }}
      >
        Softcapper
        {bestLvl.greaterThan(1) && <> ({integerCommaFormat(bestLvl)})</>}
      </Heading>
      <Container className="flex-col gap-y-2">
        {softcappers.map((softcapper, i) => {
          const index = i + 1;

          const mode = softcapper.mode;

          const power = parseValueGetter(softcapper.power, mergedPlayer);
          const startsAt = parseValueGetter(softcapper.startsAt, mergedPlayer);

          const formattedPower = formatNumber(power);

          return (
            <Paragraph
              className="text-gradient m-0 first-of-type:mt-4 last-of-type:mb-4"
              key={index}
              style={{
                backgroundImage: `var(--gradient-softcapper-level-${index})`,
              }}
            >
              Level {index}: at {formatNumber(startsAt)} -{" "}
              {mode === "pow" ? (
                <>
                  Points<Pow>{formattedPower}</Pow>
                </>
              ) : (
                `${formattedPower}x`
              )}{" "}
              {state.softcapperLevel.greaterThanOrEqualTo(index) && " (Active)"}
            </Paragraph>
          );
        })}
      </Container>
    </Container>
  );
}

export default Softcapper;
