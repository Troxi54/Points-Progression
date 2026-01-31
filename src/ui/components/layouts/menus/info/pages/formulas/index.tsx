import { getPlayerState } from "@/game/player/store/store";
import menuInfoFormulaSelector from "./selector";
import { Fragment, ReactNode } from "react";
import menuInfoFormulaContainer from "./data";
import { parseValueGetter } from "@/game/player/utils";
import VerticalContainer from "@/ui/components/base/VerticalContainer";

function MenuInfoFormulaPage() {
  menuInfoFormulaSelector();

  const { mergedPlayer } = getPlayerState();

  const formulas: ReactNode[] = menuInfoFormulaContainer.map(
    (formula, index) => {
      const shouldRender = parseValueGetter(formula.condition, mergedPlayer);
      if (!shouldRender) return null;

      const node = parseValueGetter(formula.node, mergedPlayer);

      const isFirst = index === 0;

      return (
        <Fragment key={index}>
          {!isFirst && <br />}
          <VerticalContainer className="gap-[0.1em]">
            <span>{formula.name}:</span>
            <span className="small-text bg-formula-body-bg p-[0.5em] rounded-[0.5em]">
              {node}
            </span>
          </VerticalContainer>
        </Fragment>
      );
    }
  );

  return (
    <>
      <VerticalContainer className="text-[1.5em] gap-[0.5em] py-[1em]">
        {formulas}
      </VerticalContainer>
    </>
  );
}

export default MenuInfoFormulaPage;
