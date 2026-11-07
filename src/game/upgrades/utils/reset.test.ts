import type { Player } from "@game/player/schemas";
import { describe, expect, it } from "vitest";
import { applyResetLayerUpgradeReset } from "./reset";

function playerWithUpgrades(upgrades: Player["upgrades"]): Player {
  return { upgrades } as Player;
}

function applyReset(
  upgrades: Player["upgrades"],
  resetLayerId: Parameters<typeof applyResetLayerUpgradeReset>[2],
) {
  const sourcePlayer = playerWithUpgrades(structuredClone(upgrades));
  const targetPlayer = playerWithUpgrades(structuredClone(upgrades));

  applyResetLayerUpgradeReset(targetPlayer, sourcePlayer, resetLayerId);

  return targetPlayer;
}

describe("upgrade reset retention", () => {
  it("lets Xagyros override the lower Level reset", () => {
    const player = applyReset(
      {
        dertoint: [true, true, true, true],
        mallirt: [true, true, true, true],
        level: [false, false, false, false, false, false],
        xagyros: [true],
      },
      "xagyros",
    );

    expect(player.upgrades.dertoint).toEqual([true, true, true, true]);
    expect(player.upgrades.mallirt).toEqual([true, true, true, true]);
    expect(player.upgrades.level).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it("does not let a lower layer retain upgrades after Xagyros clears them", () => {
    const player = applyReset(
      {
        dertoint: [true, true, false, false],
        mallirt: [true, false, false, false],
        level: [true],
        xagyros: [false],
      },
      "xagyros",
    );

    expect(player.upgrades.dertoint).toEqual([false, false, false, false]);
    expect(player.upgrades.mallirt).toEqual([false, false, false, false]);
  });

  it("applies Nullith retention ranges from the source snapshot", () => {
    const player = applyReset(
      {
        reset: [true, true],
        tier: [true, true, true, true, true, true],
        vermyros: [true, true, true, true, true, true, true, true, true, true],
        nullith: [false, true],
      },
      "nullith",
    );

    expect(player.upgrades.reset).toEqual([true, true]);
    expect(player.upgrades.tier).toEqual([true, true, true, true, true, true]);
    expect(player.upgrades.vermyros).toEqual([
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
