import { ResetLayerId } from "@/game/resetLayers/types";
import StatusText from "./StatusText";
import { applyToggledResetLayerAuto } from "@/game/resetLayers/utils/apply";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import { getPlayerState } from "@/game/player/store/store";
import { UsePlayerFn } from "@ui/hooks/usePlayer/types";
import { getResetLayerPlayerSelection } from "@/game/resetLayers/utils/selector";
import { mergeObjects } from "@/core/utils/object";
import {
  everPerformed,
  getResetLayerPlayerDataProp,
} from "@/game/resetLayers/utils/get";
import { BooleanGetter, ValueGetter } from "@/game/player/types";
import { parseValueGetter } from "@/game/player/utils";
import { ReactNode } from "react";
import { capitalizeString } from "@/core/utils/string";

type Props<T extends ResetLayerId = ResetLayerId> = {
  resetLayerId: T;
  usePlayerSelector?: UsePlayerFn;
  condition?: BooleanGetter;
  name?: string;
  customChildren?: ValueGetter<ReactNode, [boolean]>;
};

function AutoResetToggle<T extends ResetLayerId>({
  resetLayerId,
  usePlayerSelector,
  condition,
  name,
  customChildren,
}: Props<T>) {
  usePlayer((state) => {
    const mainSelection = getResetLayerPlayerSelection(state, resetLayerId, [
      "autoEnabled",
    ]);

    const additionalSelection = usePlayerSelector?.(state);

    return mergeObjects(mainSelection, additionalSelection);
  });

  const { player, mergedPlayer } = getPlayerState();
  const enabled = getResetLayerPlayerDataProp(
    player,
    resetLayerId,
    "autoEnabled",
  );

  const processedName =
    name === undefined ? capitalizeString(resetLayerId) : name;
  const autoName = `Auto ${processedName}`;

  const text =
    customChildren !== undefined ? (
      parseValueGetter(customChildren, mergedPlayer, enabled)
    ) : (
      <>
        {autoName}
        {": "}
        <StatusText active={enabled}></StatusText>
      </>
    );

  function toggleFunction() {
    const { mergedPlayer, player, setPlayer } = getPlayerState();

    const performed = everPerformed(player, resetLayerId);
    if (!performed) return;

    const canToggle = condition
      ? parseValueGetter(condition, mergedPlayer)
      : true;
    if (!canToggle) return;

    setPlayer(applyToggledResetLayerAuto(player, resetLayerId));
  }

  return (
    <button
      className="w-fit rounded-[0.25em] px-15"
      onClick={toggleFunction}
      aria-label={`Toggle ${autoName}`}
    >
      <p className="my-2">{text}</p>
    </button>
  );
}

export default AutoResetToggle;
