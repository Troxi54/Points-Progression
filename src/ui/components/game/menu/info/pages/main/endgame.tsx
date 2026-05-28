import gameConfig from "@core/config/data";
import { formatNumber } from "@core/format/number";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function MenuInfoMainPageEndgame() {
  const { gameProgress } = usePlayerFields({
    cachedPlayer: ["gameProgress"],
  });

  return (
    <>
      <span className="small-text">Endgame: </span>
      <span className="spoiler">
        {formatNumber(gameConfig.endgameAt)} (
        {formatNumber(gameProgress.multiply(100))}
        %)
      </span>
    </>
  );
}

export default MenuInfoMainPageEndgame;
