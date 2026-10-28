import gameConfig from "@core/config/data";
import { formatNumber } from "@core/format/number";
import Caption from "@ui/components/base/Caption";
import Spoiler from "@ui/components/base/Spoiler";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function MenuInfoMainPageEndgame() {
  const { gameProgress } = usePlayerFields({
    cachedPlayer: ["gameProgress"],
  });

  const rankTier = gameConfig.getRankTierName(gameProgress);
  const rankTierMilestones = gameConfig.rankTiers
    .map(({ name, progress }) => `${name} (${formatNumber(progress.multiply(100))}%)`)
    .join(" • ");

  return (
    <>
      <Caption>Endgame: </Caption>
      <Spoiler>
        {formatNumber(gameConfig.endgameAt)} ({formatNumber(gameProgress.multiply(100))}
        %)
      </Spoiler>
      <br />
      <Caption>Rank tier: </Caption>
      {rankTier}
      <br />
      <Caption>Milestones: </Caption>
      {rankTierMilestones}
    </>
  );
}

export default MenuInfoMainPageEndgame;
