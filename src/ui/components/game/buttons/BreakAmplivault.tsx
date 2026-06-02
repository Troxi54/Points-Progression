import { breakAmplivault } from "@game/features/amplivault/utils";
import Button from "@ui/components/base/Button";
import Container from "@ui/components/base/Container";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Heading from "../../base/Heading";
import Paragraph from "../../base/Paragraph";

function BreakAmplivault() {
  const { amplivaultBroken, reachedBreakAmplivault } = usePlayerFields({
    player: ["amplivaultBroken", "reachedBreakAmplivault"],
  });

  if (amplivaultBroken) return null;

  const noInfo = !reachedBreakAmplivault || amplivaultBroken;

  return !reachedBreakAmplivault ? (
    <Container className="from-break-amplivault-bg-1 to-break-amplivault-bg-2 w-full bg-linear-to-t">
      <Heading
        level={2}
        className="break-amplivault mt-[1em] mb-[1em] text-[1.5em] font-bold"
      >
        Requires a Nullith reset in Amplivault
      </Heading>
    </Container>
  ) : (
    <Button
      className="from-break-amplivault-bg-1 to-break-amplivault-bg-2 border-image-gradient bg-linear-to-t [border-image-source:linear-gradient(to_top,var(--color-break-amplivault-bg-1),var(--color-break-amplivault-bg-2))] hover:[border-image-source:linear-gradient(to_top,var(--color-break-amplivault-1),var(--color-break-amplivault-2))]"
      onClick={breakAmplivault}
    >
      <Heading
        level={2}
        className="break-amplivault mt-[0.5em] mb-[0.5em] text-[2em] font-bold"
      >
        Break Amplivault
      </Heading>
      {!noInfo && (
        <Paragraph className="text-gradient from-break-amplivault-info-1 to-break-amplivault-info-2 bg-linear-to-r text-balance">
          Breaking Amplivault allows the level of Amplivault to increase when
          you're not inside it. You can no longer enter Amplivault, and its
          effect becomes softcapped. This action is permanent.
        </Paragraph>
      )}
    </Button>
  );
}

export default BreakAmplivault;
