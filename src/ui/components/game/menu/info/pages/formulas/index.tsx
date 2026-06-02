import type { ReactNode } from "react";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import Caption from "@ui/components/base/Caption";
import Stack from "@ui/components/base/Stack";
import { Fragment } from "react";
import menuInfoFormulaContainer from "./data";
import useMenuInfoFormulaSelector from "./selector";

function MenuInfoFormulaPage() {
  useMenuInfoFormulaSelector();

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
          <Stack col className="gap-[0.1em]">
            <span>{formula.name}:</span>
            <Caption className="bg-formula-body-bg rounded-[0.5em] p-[0.5em] text-center">
              {node}
            </Caption>
          </Stack>
        </Fragment>
      );
    },
  );

  return (
    <>
      <Stack col className="gap-[0.5em] py-[1em] text-[1.5em]">
        {formulas}
      </Stack>
    </>
  );
}

export default MenuInfoFormulaPage;
