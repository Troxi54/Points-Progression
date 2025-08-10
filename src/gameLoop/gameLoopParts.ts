import Decimal from "break_eternity.js";
import {
  calculateOfflineNullithResets,
  calculateOfflineTierResets
} from "../offline";
import {
  MergedPlayer,
  PartialMergedPlayer,
  Player
} from "../player/playerTypes";
import { savePlayerToLocalStorage } from "../player/playerUtils";
import { settings } from "../player/settings";
import { usePlayerStore } from "../player/playerStore";
import {
  triggerMallirtReset,
  triggerNullithReset,
  triggerReset,
  triggerTierReset,
  triggerVermyrosReset
} from "../resets";

let lastTimeSave = performance.now();
export function savePlayer() {
  if (performance.now() - lastTimeSave >= settings.saveInterval) {
    lastTimeSave = performance.now();
    const player = usePlayerStore.getState().player;
    savePlayerToLocalStorage(player);
  }
}

export function onVisibilityChange() {
  if (!document.hidden) {
    calculateOfflineTierResets();
    calculateOfflineNullithResets();
  }
}

export function getMallirtUpdates(
  player: Player
): PartialMergedPlayer | undefined {
  if (
    player.dertoints.lessThan(settings.mallirtGoal) ||
    !player.autoMallirtEnabled
  )
    return;

  const lastMallirtTime =
    player.mallirtStartedDate === null
      ? Infinity
      : Date.now() - player.mallirtStartedDate;

  return {
    player: {
      ...triggerMallirtReset(player),
      everMadeMallirt: true,
      mallirtTotalDertoints: player.mallirtTotalDertoints.plus(
        player.everMadeMallirt ? player.dertoints : settings.mallirtGoal
      )
    },
    cachedPlayer: {
      lastMallirtTime: lastMallirtTime
    }
  };
}

export function getNullithUpdates({
  player,
  cachedPlayer
}: MergedPlayer): PartialMergedPlayer | undefined {
  if (
    player.points.lessThan(settings.nullithGoal) ||
    !player.autoNullithEnabled
  )
    return;

  const lastNullithTime =
    player.nullithStartedDate === null
      ? Infinity
      : Date.now() - player.nullithStartedDate;

  return {
    player: {
      ...triggerNullithReset(player),
      everMadeNullith: true,
      everMadeVermyros: true,
      everMadeTier: true,
      everMadeRun: true,
      madeNullithResets: player.madeNullithResets.plus(
        cachedPlayer.nullithResetGain
      )
    },
    cachedPlayer: {
      lastNullithTime: lastNullithTime
    }
  };
}

export function getVermyrosUpdates({
  player,
  cachedPlayer
}: MergedPlayer): PartialMergedPlayer | undefined {
  if (
    player.points.lessThan(settings.vermyrosGoal) ||
    !player.autoVermyrosEnabled
  )
    return;

  const lastVermyrosTime =
    player.vermyrosStartedDate === null
      ? Infinity
      : Date.now() - player.vermyrosStartedDate;

  return {
    player: {
      ...triggerVermyrosReset(player),
      everMadeVermyros: true,
      everMadeTier: true,
      everMadeRun: true,
      vermytes: player.vermytes.plus(cachedPlayer.vermytesGain),
      bestVermytes: cachedPlayer.vermytesGain.greaterThan(player.bestVermytes)
        ? cachedPlayer.vermytesGain
        : player.bestVermytes
    },
    cachedPlayer: {
      lastVermyrosTime: lastVermyrosTime
    }
  };
}

export function getTierUpdates({
  player,
  cachedPlayer
}: MergedPlayer): PartialMergedPlayer | undefined {
  let bulk = player.points
    .dividedBy(cachedPlayer.tierRequirement)
    .log(settings.tierScaling)
    .floor();

  if (!player.boughtSecondVermyrosUpgrade) {
    if (player.points.lessThan(settings.firstTierAt) || !player.autoTierEnabled)
      return;
    if (player.points.lessThan(cachedPlayer.tierRequirement))
      bulk = new Decimal(-1);
  } else {
    if (
      player.points.lessThan(cachedPlayer.tierRequirement) ||
      !player.autoTierEnabled
    )
      return;
  }

  if (player.boughtFourthVermyrosUpgrade) {
    return {
      player: {
        tier: player.tier.plus(bulk.plus(1))
      }
    };
  }

  const lastTierTime =
    player.tierStartedDate === null
      ? Infinity
      : Date.now() - player.tierStartedDate;

  return {
    player: {
      ...triggerTierReset(player),
      everMadeTier: true,
      everMadeRun: true,
      tier: player.tier.plus(bulk.plus(1)),
      madeTierTimes: player.madeTierTimes.plus(cachedPlayer.tierResetGain)
    },
    cachedPlayer: {
      lastTierTime: lastTierTime
    }
  };
}

export function getGoalUpdates(player: Player): PartialMergedPlayer {
  const DAY_IN_MS = 8.64e7;
  let autoSet = {};
  if (player.boughtThirdTierUpgrade) {
    autoSet = {
      player: {
        bestRun: settings.bestRunTimeLimit,
        bestPointsOfRun: player.boughtFourthTierUpgrade
          ? player.points.greaterThan(player.bestPointsOfRun)
            ? player.points
            : player.bestPointsOfRun
          : player.bestPointsOfRun
      }
    };
  }
  if (
    player.points.lessThan(settings.firstResetLayerGoal) ||
    !player.autoresettingEnabled
  )
    return autoSet;
  const timeSpent = Math.max(
    Math.min(Date.now() - player.startedRun, DAY_IN_MS),
    settings.bestRunTimeLimit
  );

  const lastResetTime = Date.now() - player.startedRun;

  return {
    player: {
      ...autoSet,
      ...triggerReset(),
      bestPointsOfRun: player.points.greaterThan(player.bestPointsOfRun)
        ? player.points
        : player.bestPointsOfRun,
      everMadeRun: true,
      bestRun: player.boughtThirdTierUpgrade
        ? settings.bestRunTimeLimit
        : player.bestRun === null
        ? timeSpent
        : timeSpent < player.bestRun
        ? timeSpent
        : player.bestRun
    },
    cachedPlayer: {
      lastResetTime: lastResetTime
    }
  };
}

const TIER_INTERVAL = 1 / 60;
const MAX_TIER_PER_SECOND = 1 / TIER_INTERVAL;
export function generateTierResets(
  { player, cachedPlayer }: MergedPlayer,
  deltaTime: number
): Partial<Player> | undefined {
  if (!player.boughtSecondVermyrosUpgrade) return;
  return {
    madeTierTimes: player.madeTierTimes.plus(
      Decimal.multiply(MAX_TIER_PER_SECOND, deltaTime).multiply(
        cachedPlayer.tierResetGain
      )
    )
  };
}

export function generateVermytes(
  { player, cachedPlayer }: MergedPlayer,
  deltaTime: number = 0
): Partial<Player> {
  const generation = cachedPlayer.vermytesPerSecond;
  if (generation.lessThanOrEqualTo(0)) return {};
  return {
    vermytes: player.vermytes.plus(generation.multiply(deltaTime))
  };
}

export function generateCores(
  { player, cachedPlayer }: MergedPlayer,
  deltaTime: number = 0
): Partial<Player> {
  const generation = cachedPlayer.coresPerSecond;
  if (generation.lessThanOrEqualTo(0)) return {};
  return {
    cores: player.cores.plus(generation.multiply(deltaTime))
  };
}

export function getSoftcapperUpdates({
  player,
  cachedPlayer
}: MergedPlayer): PartialMergedPlayer {
  let lvl = new Decimal(0);
  for (const softcapper of settings.softcappers) {
    if (cachedPlayer.pointGain.lessThan(softcapper[0])) break;
    lvl = lvl.plus(1);
  }
  return {
    player: {
      bestSoftcapperLevel: lvl.greaterThan(player.bestSoftcapperLevel)
        ? lvl
        : player.bestSoftcapperLevel
    },
    cachedPlayer: {
      softcapperLevel: lvl
    }
  };
}
