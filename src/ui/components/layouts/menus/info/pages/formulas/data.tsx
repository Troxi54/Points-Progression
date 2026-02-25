import { getRepeatableUpgradeData } from "@/game/repeatableUpgrades/utils/get";
import { MenuInfoFormulaContainer } from "./types";
import { formatNumber, integerCommaFormat } from "@/core/format/number";
import UISymbols from "@/app/UISymbols";
import Stat from "@/ui/components/base/Stat";
import { everPerformed, getResetLayerData } from "@/game/resetLayers/utils/get";
import Log from "@/ui/components/base/Log";
import Pow from "@/ui/components/base/Pow";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import Min from "@/ui/components/base/Min";
import amplivaultConfig from "@/game/features/amplivault/config";
import nuxarConfig from "@game/features/nuxar/config";
import cappergyConfig from "@game/features/cappergy/config";

const menuInfoFormulaContainer: MenuInfoFormulaContainer = [
  {
    condition: true,
    name: "Point Upgrade Cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("point");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: true,
    name: "Point Upgrade Effect",
    node: () => (
      <>
        1.125
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "reset"),
    name: "Best run effect",
    node: () => {
      const bestRun = <Stat>best run</Stat>;
      const firstPart = (
        <Min
          values={[
            <>
              1 {UISymbols.plus} <Log base={"2 hours"}>{bestRun}</Log>
            </>,
            2,
          ]}
        />
      );

      return (
        <>
          If best run {UISymbols.lessThanOrEqualTo} 2 hours:
          <br />
          {firstPart} {UISymbols.multiply} 5
          <Pow>
            (<Log>2 hours</Log> {UISymbols.minus} <Log>{bestRun}</Log>)
          </Pow>
          <br />
          Otherwise:
          <br />
          {firstPart}
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "reset"),
    name: "Best Point effect",
    node: () => {
      const formattedMillion = integerCommaFormat(1_000_000);
      return (
        <>
          (1 {UISymbols.plus}{" "}
          <Log>
            <Stat>best points</Stat>
            {UISymbols.divide} {formattedMillion}
          </Log>
          )<Pow>1.3</Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "tier"),
    name: "Tier requirement",
    node: () => {
      const tierData = getResetLayerData("tier");
      return (
        <>
          {formatNumber(tierData.goal)} {UISymbols.multiply}{" "}
          {integerCommaFormat(1_000)}
          <Pow>
            <Stat>tier</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "tier"),
    name: "Tier effect",
    node: () => (
      <>
        3
        <Pow>
          <Stat>tier</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "tier"),
    name: "Tier Reset effect",
    node: () => (
      <>
        (<Stat>tier resets</Stat> {UISymbols.plus} 1)
        <Pow>1.2</Pow>
        <br />
        <span className="muted">
          Tier resets softcapped after {integerCommaFormat(1_000_000)} (power
          0.25)
        </span>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "tier_4") || everPerformed(player, "vermyros"),
    name: "Ampliflux effect",
    node: () => (
      <>
        2
        <Pow>
          <Log>
            <Stat>ampliflux</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "tier_4") || everPerformed(player, "vermyros"),
    name: "Ampliflux Upgrade cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("ampliflux");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "tier_4") || everPerformed(player, "vermyros"),
    name: "Ampliflux Upgrade effect",
    node: () => (
      <>
        1.1
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "vermyros"),
    name: "Vermyte gain",
    node: () => {
      const resetData = getResetLayerData("vermyros");
      const formattedMillion = integerCommaFormat(1_000_000);
      const points = <Stat>points</Stat>;
      const formattedGoal = formatNumber(resetData.goal);

      return (
        <>
          2
          <Pow>
            <Log base={formattedMillion}>
              {points} {UISymbols.divide} {formattedGoal}
            </Log>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "vermyros"),
    name: "Best Vermytes effect",
    node: () => (
      <>
        <Stat>best vermytes</Stat>
        <Pow>3</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "vermyros"),
    name: "Vermora effect",
    node: () => (
      <>
        2
        <Pow>
          <Log>
            <Stat>vermora</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_1") || everPerformed(player, "nullith"),
    name: "Vermyte Upgrade cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("vermyte");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_1") || everPerformed(player, "nullith"),
    name: "Vermyte Upgrade effect",
    node: () => (
      <>
        3
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_5") || everPerformed(player, "nullith"),
    name: "Amplivault level requirement",
    node: () => (
      <>
        {formatNumber(amplivaultConfig.requirementStartsAt)}{" "}
        {UISymbols.multiply} {integerCommaFormat(1_000)}
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      player.amplivaultLevel.greaterThan(0) || everPerformed(player, "nullith"),
    name: "Amplivault effect",
    node: ({ player }) => {
      const powLvl = (
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      );
      const ifNotBroken = <>2{powLvl}</>;

      const notBroken = !player.amplivaultBroken;
      if (notBroken) return ifNotBroken;

      return (
        <>
          If broken: 1.5{powLvl}
          <br />
          Otherwise: {ifNotBroken}
        </>
      );
    },
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_8") || everPerformed(player, "nullith"),
    name: "Energy effect",
    node: () => (
      <>
        1.75
        <Pow>
          <Log>
            <Stat>energy</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everReachedCores,
    name: "Core gain",
    node: () => (
      <>
        <Stat>energy</Stat> {UISymbols.divide} {integerCommaFormat(1_000_000)}
      </>
    ),
  },
  {
    condition: ({ player }) => player.everMadeCoreReset,
    name: "Core effect",
    node: () => (
      <>
        4
        <Pow>
          <Log>
            <Stat>cores</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everMadeCoreReset,
    name: "Core Upgrade cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("core");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => player.everMadeCoreReset,
    name: "Core Upgrade effect",
    node: () => (
      <>
        1.1
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_10") || everPerformed(player, "nullith"),
    name: "Dark Energy gain",
    node: () => (
      <>
        2
        <Pow>
          <Log base={formatNumber(1e10)}>
            <Stat>points</Stat> {UISymbols.divide} {formatNumber(1e250)}
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) =>
      hasUpgradeById(player, "vermyros_10") || everPerformed(player, "nullith"),
    name: "Dark Energy effect",
    node: () => (
      <>
        1.75
        <Pow>
          <Log>
            <Stat>dark energy</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "nullith"),
    name: "Nullith Reset's Point effect",
    node: () => (
      <>
        125 {UISymbols.multiply} <Stat>nullith resets</Stat>
        <Pow>3</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "nullith"),
    name: "Nullith Reset's Vermyte effect",
    node: () => (
      <>
        (<Stat>nullith resets</Stat> {UISymbols.plus} 1)<Pow>1.2</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "nullith"),
    name: "Nullith Reset's Energy effect",
    node: () => (
      <>
        (<Stat>nullith resets</Stat> {UISymbols.plus} 1)<Pow>0.75</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "nullith_4"),
    name: "Nullion effect",
    node: () => (
      <>
        3
        <Pow>
          <Log>
            <Stat>nullions</Stat> {UISymbols.divide} {integerCommaFormat(5e4)}{" "}
            {UISymbols.plus} 1
          </Log>
        </Pow>
        <br />
        <span className="muted">
          Nullions softcapped after {formatNumber(1e12)} (power 0.5), softcapped
          again after {formatNumber(1e15)} (power 0.5)
        </span>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everEnteredSliph,
    name: "Dertoint effect",
    node: () => (
      <>
        1 {UISymbols.plus}{" "}
        <Log>
          <Stat>dertoints</Stat> {UISymbols.multiply} 100 {UISymbols.plus} 1
        </Log>{" "}
        {UISymbols.divide} 2.5
      </>
    ),
  },
  {
    condition: ({ player }) => player.everEnteredSliph,
    name: "Dertoint Upgrade cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("dertoint");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => player.everEnteredSliph,
    name: "Dertoint Upgrade effect",
    node: () => (
      <>
        2.35
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everEnteredSliph,
    name: "Dertoint Upgrade 1 effect",
    node: () => (
      <>
        1.15
        <Pow>
          <Log base={integerCommaFormat(100_000)}>
            <Stat>points</Stat> {UISymbols.divide} {formatNumber("1e1000")}{" "}
            {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "mallirt"),
    name: "Total Dertoint effect",
    node: () => (
      <>
        3
        <Pow>
          <Log>
            <Stat>total dertoints</Stat> {UISymbols.divide}{" "}
            {integerCommaFormat(133456)} {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "nullith_6"),
    name: "Nux gain",
    node: () => (
      <>
        (<Stat>nullions</Stat> {UISymbols.divide}{" "}
        {formatNumber(nuxarConfig.requirement)})<Pow>0.9</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "nullith_6"),
    name: "Nux effect",
    node: () => (
      <>
        2.65
        <Pow>
          (
          <Log>
            <Stat>nux</Stat>
          </Log>{" "}
          {UISymbols.plus} 1)
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everReachedCappergy,
    name: "Cappergy gain",
    node: () => (
      <>
        3.5
        <Pow>
          <Log>
            (<Stat>points</Stat> {UISymbols.plus} <Stat>point gain</Stat>){" "}
            {UISymbols.divide} {formatNumber(cappergyConfig.startEarningAt)}
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.everReachedCappergy,
    name: "Cappergy effect",
    node: () => {
      const n = <Stat>cappergy</Stat>;

      return (
        <>
          1 {UISymbols.divide} ((1 {UISymbols.plus} <Log>{n}</Log>)
          <Pow>0.055</Pow> {UISymbols.multiply} (1 {UISymbols.plus}{" "}
          <Log base={formatNumber(1e10)}>{n}</Log> {UISymbols.divide} 35))
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "level"),
    name: "Score gain",
    node: () => {
      const formattedGoal = formatNumber(getResetLayerData("level").goal);

      return (
        <>
          2
          <Pow>
            <Log base={100}>
              <Stat>dertoints</Stat> {UISymbols.divide} {formattedGoal}
            </Log>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => everPerformed(player, "level"),
    name: "Score effect",
    node: () => (
      <>
        <Min
          values={[
            <>
              (1 {UISymbols.minus} 1 {UISymbols.divide} 2
              <Pow>
                <Log base={formatNumber("1e100")}>
                  <Stat>score {UISymbols.plus} 1</Stat>
                </Log>
              </Pow>
              ) {UISymbols.multiply} 100
            </>,
            0.1,
          ]}
        />
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "level"),
    name: "Level requirement",
    node: () => (
      <>
        2
        <Pow>
          <Stat>level</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => everPerformed(player, "level"),
    name: "Level effect",
    node: () => (
      <>
        3
        <Pow>
          <Stat>level</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(1),
    name: "Point Nullith effect",
    node: () => (
      <>
        2
        <Pow>
          <Log base={formatNumber("1e100")}>
            <Stat>points</Stat> {UISymbols.divide} {formatNumber("1e1200")}
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(2),
    name: "Best run Dertoint effect",
    node: () => (
      <>
        <Stat>best run effect</Stat> {UISymbols.divide}{" "}
        {integerCommaFormat(1000)}
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(3),
    name: "Best Point Vermora effect",
    node: () => (
      <>
        <Stat>best point effect</Stat>
        <Pow>0.75</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(4),
    name: "Tier Vermyte effect",
    node: () => (
      <>
        1.7
        <Pow>
          (<Stat>tier</Stat> {UISymbols.minus} 350)
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(5),
    name: "Tier Reset's Dertoint effect",
    node: () => (
      <>
        (<Stat>tier resets</Stat> {UISymbols.plus} 1)
        <Pow>1.05</Pow>
        <br />
        <span className="muted">
          Tier resets softcapped after {integerCommaFormat(1_000_000)} (power
          0.1)
        </span>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "level_4"),
    name: "Amplivoid gain",
    node: () => (
      <>
        1.6
        <Pow>
          <Log base={formatNumber("1e10")}>
            <Stat>ampliflux</Stat> {UISymbols.divide} {formatNumber("1e1075")}
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "level_4"),
    name: "Amplivoid effect",
    node: () => (
      <>
        (<Stat>amplivoid</Stat> {UISymbols.plus} 1)<Pow>1.75</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "level_4"),
    name: "Amplivoid Upgrade cost",
    node: () => {
      const upgradeData = getRepeatableUpgradeData("amplivoid");
      return (
        <>
          {formatNumber(upgradeData.startCost)} {UISymbols.multiply}{" "}
          {formatNumber(upgradeData.costScaling)}
          <Pow>
            <Stat>lvl</Stat>
          </Pow>
        </>
      );
    },
  },
  {
    condition: ({ player }) => hasUpgradeById(player, "level_4"),
    name: "Amplivoid Upgrade effect",
    node: () => (
      <>
        2
        <Pow>
          <Stat>lvl</Stat>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(6),
    name: "Ampliflux Tier Reset effect",
    node: () => (
      <>
        1.125
        <Pow>
          <Log>
            <Stat>ampliflux</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(7),
    name: "Best Vermytes Point effect",
    node: () => (
      <>
        <Stat>best vermytes</Stat>
        <Pow>3.75</Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(8),
    name: "Vermora Amplivoid effect",
    node: () => (
      <>
        1.075
        <Pow>
          <Log>
            <Stat>vermora</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
  {
    condition: ({ player }) => player.bestNexusLevel.greaterThanOrEqualTo(9),
    name: "Vermyte Score effect",
    node: () => (
      <>
        1.075
        <Pow>
          <Log>
            <Stat>vermytes</Stat> {UISymbols.plus} 1
          </Log>
        </Pow>
      </>
    ),
  },
];

export default menuInfoFormulaContainer;
