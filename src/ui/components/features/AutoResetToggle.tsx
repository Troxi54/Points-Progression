import type { BooleanGetter, ValueGetter } from "@game/player/types";
import type { ResetLayerId } from "@game/resetLayers/types";
import type { PlayerSelectorFn } from "@ui/hooks/usePlayer/types";
import type { ReactNode } from "react";
import { mergeObjects } from "@core/utils/object";
import { capitalizeString } from "@core/utils/string";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import { applyToggledResetLayerAuto } from "@game/resetLayers/utils/apply";
import {
  everPerformed,
  getResetLayerPlayerDataProp,
} from "@game/resetLayers/utils/get";
import { getResetLayerPlayerSelection } from "@game/resetLayers/utils/selector";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import StatusText from "../base/StatusText";
import Paragraph from "../base/Paragraph";

interface Props<T extends ResetLayerId = ResetLayerId> {
  resetLayerId: T;
  playerSelector?: PlayerSelectorFn;
  condition?: BooleanGetter;
  name?: string;
  customChildren?: ValueGetter<ReactNode, [boolean]>;
}

function AutoResetToggle<T extends ResetLayerId>({
  resetLayerId,
  playerSelector,
  condition,
  name,
  customChildren,
}: Props<T>) {
  usePlayer((state) => {
    const mainSelection = getResetLayerPlayerSelection(state, resetLayerId, [
      "autoEnabled",
    ]);

    const additionalSelection = playerSelector?.(state);

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
      <Paragraph className="my-2">{text}</Paragraph>
    </button>
  );
}

export default AutoResetToggle;
