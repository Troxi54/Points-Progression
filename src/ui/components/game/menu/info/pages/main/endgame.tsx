import gameConfig from "@core/config/data";
import { formatNumber } from "@core/format/number";
import Caption from "@ui/components/base/Caption";
import Spoiler from "@ui/components/base/Spoiler";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function MenuInfoMainPageEndgame() {
  const { gameProgress } = usePlayerFields({
    cachedPlayer: ["gameProgress"],
  });

  return (
    <>
      <Caption>Endgame: </Caption>
      <Spoiler>
        {formatNumber(gameConfig.endgameAt)} (
        {formatNumber(gameProgress.multiply(100))}
        %)
      </Spoiler>
    </>
  );
}

export default MenuInfoMainPageEndgame;
