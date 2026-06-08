import cn from "@core/utils/tailwind";
import { toggleAntinefit } from "@game/features/antinefit/utils";
import Button from "@ui/components/base/Button";
import Container from "@ui/components/base/Container";
import Paragraph from "@ui/components/base/Paragraph";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function Antinefit() {
  const { enteredAntinefit } = usePlayerFields({
    player: ["enteredAntinefit"],
  });

  return (
    <Button
      onClick={toggleAntinefit}
      className="bg-antinefit-bg hover:border-antinefit"
    >
      <Container className="bg-antinefit-animation-bg border-antinefit-animation-border relative size-20 overflow-hidden border-2 *:absolute">
        <Container className="*:border-antinefit-animation-border *:absolute *:size-20 *:border-2">
          <Container className="rotate-[22.5deg]"></Container>
          <Container className="rotate-45"></Container>
          <Container className="rotate-[67.5deg]"></Container>
        </Container>
        <Container
          className={cn(
            "bg-antinefit-animation-circle-bg border-antinefit-animation-circle-border relative size-full animate-[antinefit-circle-animation_2s_infinite] items-center rounded-full border-2",
            !enteredAntinefit && "paused",
          )}
        >
          <Container className="bg-antinefit-animation-line-bg relative h-0.5 w-full items-center">
            <Container className="absolute right-0 size-2 rounded-full bg-inherit" />
            <Container className="absolute left-0 size-2 rounded-full bg-inherit" />
          </Container>
          <Container className="bg-antinefit-animation-line-bg absolute h-0.5 w-full rotate-90 items-center">
            <Container className="absolute right-0 size-2 bg-inherit" />
            <Container className="absolute left-0 size-2 bg-inherit" />
          </Container>
        </Container>
      </Container>
      <Paragraph className="text-antinefit-info">
        Antinefit -{" "}
        <span className="text-antinefit-description">
          entering Antinefit triggers a Nullith reset. Inside, you gain Anti
          Points that exponentially reduce your point gain. Outside, Anti Points
          boost a new currency
        </span>
      </Paragraph>
    </Button>
  );
}

export default Antinefit;
