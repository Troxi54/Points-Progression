import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import XagyrosStateComponent from "./XagyrosState";
import VerticalContainer from "@ui/components/base/VerticalContainer";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import cn from "@core/utils/tailwind";

function XagyrosStatesComponent() {
  const state = usePlayerFields({
    player: ["xagyrosStates"],
    cachedPlayer: ["maxXagyrosStates"],
  });

  return (
    <VerticalContainer className="gap-0 [background-image:var(--xagyros-states-gradient-bg)] default-font-weight">
      <p className="mt-6">
        <span className="xagyros-states">Xagyros states - </span>
        <span className="xagyros-states-description">
          activate states to gain bonuses. Each state has its own Xagora, which
          is generated while the state is active. Inactive states provide weaker
          effects. Dertoints also boost Xagora. Activating a state triggers a
          Xagyros reset
        </span>
      </p>
      <h2 className="xagyros-states font-bold">
        Active states: {state.xagyrosStates.length} / {state.maxXagyrosStates}
      </h2>
      <HorizontalContainer className="w-full gap-0 items-stretch overflow-x-auto justify-start">
        <XagyrosStateComponent
          state="dertoints"
          title="Dertoints"
          className="bg-dertoint-upgrade-bg hover:border-dertoint-upgrade-accent"
          textClassName="text-dertoint-upgrade-accent"
          effectClassName="text-dertoint-upgrade-effect"
        />
        <XagyrosStateComponent
          state="points"
          title="Points"
          className="bg-point-upgrade-bg hover:border-point-upgrade-accent"
          textClassName="text-point-upgrade-accent"
          effectClassName="text-point-upgrade-effect"
        />
        <XagyrosStateComponent
          state="nullithResets"
          title="Nullith Resets"
          className={cn(
            "[background-image:var(--nullith-gradient-bg)]",
            "border-image-gradient [border-image-source:var(--nullith-gradient-bg)] hover:[border-image-source:var(--nullith-gradient)]",
          )}
        />
        <XagyrosStateComponent
          state="nux"
          title="Nux"
          className={cn(
            "[background-image:var(--nuxar-gradient-bg)]",
            "border-image-gradient [border-image-source:var(--nuxar-gradient-bg)]",
            "hover:[border-image-source:var(--nuxar-gradient-border)]",
          )}
          textClassName="nuxar"
          effectClassName="nuxar-description"
        />
      </HorizontalContainer>
    </VerticalContainer>
  );
}

export default XagyrosStatesComponent;
