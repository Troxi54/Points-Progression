import type { Player } from "@game/player/types";
import { describe, expect, it } from "vitest";
import { applyResetLayerUpgradeReset } from "./reset";

function playerWithUpgrades(upgrades: Player["upgrades"]): Player {
  return { upgrades } as Player;
}

describe("upgrade reset retention", () => {
  it("lets Xagyros override the lower Level reset", () => {
    const player = playerWithUpgrades({
      dertoint: [true, true, true, true],
      mallirt: [true, true, true, true],
      level: [false, false, false, false, false, false],
      xagyros: [true],
    });

    const result = applyResetLayerUpgradeReset(player, player, "xagyros");

    expect(result.upgrades?.dertoint).toEqual([true, true, true, true]);
    expect(result.upgrades?.mallirt).toEqual([true, true, true, true]);
    expect(result.upgrades?.level).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it("does not let a lower layer retain upgrades after Xagyros clears them", () => {
    const player = playerWithUpgrades({
      dertoint: [true, true, false, false],
      mallirt: [true, false, false, false],
      level: [true],
      xagyros: [false],
    });

    const result = applyResetLayerUpgradeReset(player, player, "xagyros");

    expect(result.upgrades?.dertoint).toEqual([false, false, false, false]);
    expect(result.upgrades?.mallirt).toEqual([false, false, false, false]);
  });

  it("applies Nullith retention ranges from the source snapshot", () => {
    const player = playerWithUpgrades({
      reset: [true, true],
      tier: [true, true, true, true, true, true],
      vermyros: [true, true, true, true, true, true, true, true, true, true],
      nullith: [false, true],
    });

    const result = applyResetLayerUpgradeReset(player, player, "nullith");

    expect(result.upgrades?.reset).toEqual([true, true]);
    expect(result.upgrades?.tier).toEqual([true, true, true, true, true, true]);
    expect(result.upgrades?.vermyros).toEqual([
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
