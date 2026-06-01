import { integerCommaFormat } from "@core/format/number";
import cn from "@core/utils/tailwind";
import { formatCurrency } from "@game/currencies/utils/format";
import nexusMilestones from "@game/features/nexus/data";
import { buyNexus } from "@game/features/nexus/utils/buy";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import StatusText from "@ui/components/base/StatusText";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Paragraph from "../../base/Paragraph";
import Button from "@ui/components/base/Button";
import Container from "@ui/components/base/Container";

function Nexus() {
  const { nexusLevel, bestNexusLevel, nexusCost, enough } = usePlayerFields(
    {
      player: ["nexusLevel", "bestNexusLevel"],
      cachedPlayer: ["nexusCost"],
    },
    {
      useFormat: true,
      additionalSelectors: ({ mergedPlayer: { player, cachedPlayer } }) => {
        const { nexusCost } = cachedPlayer;

        return {
          enough:
            nexusCost === null
              ? false
              : player.nux.greaterThanOrEqualTo(nexusCost),
        };
      },
    },
  );

  const { mergedPlayer } = getPlayerState();

  const formattedCurrency = () => (
    <StatusText
      active={enough}
      customNode={nexusCost === null ? null : formatCurrency(nexusCost, "nux")}
    />
  );

  return (
    <Button
      className={cn(
        "[background-image:var(--nexus-gradient-bg)] items-center",
        "border-image-gradient [border-image-source:var(--nexus-gradient-bg)] hover:[border-image-source:var(--nexus-gradient)]",
      )}
      onClick={buyNexus}
    >
      <Paragraph>
        <span className="nexus">Nexus - </span>
        <span className="nexus-description">
          upgrade your Nexus with Nux to awaken the hidden potential of past
          features
        </span>
        <br />
        {nexusLevel.greaterThan(0) ? (
          <>
            <span className="nexus">
              Nexus Level: {integerCommaFormat(nexusLevel)}
              {nexusCost === null ? " (Maxed)" : ", for the next one: "}
            </span>
            {nexusCost !== null && <>{formattedCurrency()}</>}
          </>
        ) : (
          nexusCost && (
            <>
              <span className="nexus">You need:</span> {formattedCurrency()}
            </>
          )
        )}
      </Paragraph>
      <Container className="flex-col w-[50em] max-w-9/10 max-h-[9em] justify-start overflow-y-auto rounded-[1em] gap-0">
        {nexusMilestones
          .slice(0, bestNexusLevel.toNumber())
          .map(({ description }, index) => {
            const parsed = parseValueGetter(description, mergedPlayer);
            const milestoneNumber = index + 1;

            return (
              <div
                key={index}
                className="w-full"
                style={{
                  backgroundColor: `var(--nexus-milestone-${milestoneNumber}-bg)`,
                }}
              >
                <Paragraph
                  className="text-white"
                  style={{
                    color: `var(--nexus-milestone-${milestoneNumber})`,
                  }}
                >
                  {milestoneNumber}. {parsed}
                </Paragraph>
              </div>
            );
          })}
      </Container>
    </Button>
  );
}

export default Nexus;
