import { format } from "@/format";
import { usePlayer } from "@player/playerStore";
import { settings } from "@player/settings";

const formats = [
  ["M", 6],
  ["B", 9],
  ["T", 12],
  ["U", 18],
  ["U+", 24],
  ["U++", 30],
  ["A", 36],
  ["A+", 42],
  ["A++", 48],
  ["C", 54],
  ["C+", 60],
  ["C++", 66],
  ["S", 72],
  ["S+", 78],
  ["S++", 84],
  ["O", 90],
  ["O+", 96],
  ["O++", 102],
  ["N", 108],
  ["N+", 114],
  ["N++", 120],
  ["D", 126],
  ["D+", 132],
  ["D++", 138],
  ["L", 144],
  ["L+", 150],
  ["L++", 156],
  ["OP", 162],
  ["OP+", 168],
  ["OP++", 174],
  ["OP*", 180],
  ["OP**", 186],
  ["OP^", 192],
  ["OP^^", 198],
  ["i", 204]
];

function MenuInfo() {
  const state = usePlayer((state) => ({
    everMadeRun: state.player.everMadeRun,
    everMadeTier: state.player.everMadeTier,
    everMadeVermyros: state.player.everMadeVermyros,
    everMadeNullith: state.player.everMadeNullith,
    everReachedCores: state.player.everReachedCores,
    everMadeCoreReset: state.player.everMadeCoreReset,
    boughtFourthTierUpgrade: state.player.boughtFourthTierUpgrade,
    boughtFirstVermyrosUpgrade: state.player.boughtFirstVermyrosUpgrade,
    boughtFifthVermyrosUpgrade: state.player.boughtFifthVermyrosUpgrade,
    boughtEighthVermyrosUpgrade: state.player.boughtEighthVermyrosUpgrade,
    boughtTenthVermyrosUpgrade: state.player.boughtTenthVermyrosUpgrade,
    amplivaultLevel: state.player.amplivaultLevel,
    amplivaultBroken: state.player.amplivaultBroken,
    boughtFourthNullithUpgrade: state.player.boughtFourthNullithUpgrade,
    everEnteredSliph: state.player.everEnteredSliph,
    everMadeMallirt: state.player.everMadeMallirt
  }));

  return (
    <>
      <h1>About this game</h1>
      <p className="text-balance">
        The game has a lot of timewalls, and even begins with one - so be
        prepared for that. At first, the game may feel slow and uninteresting,
        but once you reach 1M points, the experience becomes much more engaging.
        Additionally, all upgrades without level limits can be purchased
        multiple levels at once, but you only pay for the last level. For
        example, if the cost for levels 1, 2, and 3 is 10, 20, and 30 points
        respectively, you only pay 30 points for upgrading to level 3 directly.
        With this knowledge, you can drastically speed up your progress.
      </p>
      <p className="info-important mb-[3em]">
        Frequently exporting your save is highly recommended because the game is
        still in beta, and potential bugs may reset your progress.
      </p>
      <h2>Number notation</h2>
      <p className="mb-0">
        The game also has a unique number notation system, here it is:
      </p>
      <p className="mb-[3em]">
        1k = 1000
        <br />
        {formats.map((format, index) => (
          <span key={index}>
            1{format[0]} = 10<sup>{format[1]}</sup>
            <br />
          </span>
        ))}
        <br />
        Exponential at 10<sup>213</sup>
      </p>
      <h2>Formulas</h2>
      <p>
        Upgrade cost:
        <span className="info-effect">
          {" "}
          {format(settings.upgradeStartingCost)} ×{" "}
          {format(settings.upgradeScaling)}
          <sup>x</sup>, where x is the upgrade level
        </span>
        <br />
        Upgrade effect:
        <span className="info-effect">
          {" "}
          {format(settings.upgradeEffectScaling)}
          <sup>x</sup>, where x is the upgrade level
        </span>
        {state.everMadeRun && (
          <>
            <br />
            Best run effect:
            <br />
            <span className="info-effect">
              if best run is less than or equal to 2 hours: min(1 + log(y) /
              log(x), 2) × 5<sup>log(y) - log(x)</sup>
              <br />
              Otherwise: min(1 + log(y) / log(x), 2)
              <br />
              Where: x is best run (in milliseconds) and y is 2 hours (in
              milliseconds)
            </span>
          </>
        )}
        {state.everMadeRun && (
          <>
            <br />
            Best points effect:
            <span className="info-effect">
              {" "}
              (1 + log(max(x, 1,000,000) / 1,000,000))<sup>1.3</sup>, where x is
              best points
            </span>
          </>
        )}
        {state.everMadeTier && (
          <>
            <br />
            Tier requirement:
            <span className="info-effect">
              {" "}
              {format(settings.firstTierAt)} × 1,000<sup>x</sup>, where x is
              tier
            </span>
            <br />
            Tier effect:
            <span className="info-effect">
              {" "}
              3<sup>x</sup>, where x is tier
            </span>
            <br />
            Tier resets made effect:
            <br />
            <span className="info-effect">
              if tier resets made are less than 1,000,000: (x + 1)
              <sup>1.2</sup>
              <br />
              Otherwise: (1,000,000 × ((x + 1) / 1,000,000)<sup>0.25</sup>)
              <sup>1.2</sup>
              <br />
              Where x is tier resets made
            </span>
          </>
        )}
        {(state.boughtFourthTierUpgrade || state.everMadeVermyros) && (
          <>
            <br />
            Ampliflux effect:
            <span className="info-effect">
              {" "}
              2<sup>log(x + 1)</sup>, where x is ampliflux
            </span>
            <br />
            Ampliflux upgrade cost:
            <span className="info-effect">
              {" "}
              {format(settings.amplifluxUpgradeStartingCost)} ×{" "}
              {format(settings.amplifluxUpgradeCostScaling)}
              <sup>x</sup>, where x is the ampliflux upgrade level
            </span>
            <br />
            Ampliflux upgrade effect:
            <span className="info-effect">
              {" "}
              {format(settings.amplifluxUpgradeEffectScaling)}
              <sup>x</sup>, where x is the ampliflux upgrade level
            </span>
          </>
        )}
        {state.everMadeVermyros && (
          <>
            <br />
            Vermytes:{" "}
            <span className="info-effect">
              <br />
              if points are greater than {format(settings.vermyrosGoal)}: 2
              <sup>
                max(log<sub>1,000,000</sub>(x / {format(settings.vermyrosGoal)}
                ), 0)
              </sup>
              <br />
              Otherwise: 0
              <br />
              Where x is points
            </span>
            <br />
            Best vermytes effect:
            <span className="info-effect">
              {" "}
              x<sup>3</sup>, where x is best vermytes
            </span>
            <br />
            Vermora effect:
            <span className="info-effect">
              {" "}
              2<sup>log(x + 1)</sup>, where x is vermora
            </span>
          </>
        )}
        {(state.boughtFirstVermyrosUpgrade || state.everMadeNullith) && (
          <>
            <br />
            Vermyte upgrade cost:
            <span className="info-effect">
              {" "}
              {format(settings.vermytesUpgradeCostScaling)}
              <sup>x</sup>, where x is the vermyte upgrade level
            </span>
            <br />
            Vermyte upgrade effect:
            <span className="info-effect">
              {" "}
              {format(settings.vermytesUpgradeEffectScaling)}
              <sup>x</sup>, where x is the vermyte upgrade level
            </span>
          </>
        )}
        {(state.boughtFifthVermyrosUpgrade || state.everMadeNullith) && (
          <>
            <br />
            Amplivault level requirement:
            <span className="info-effect">
              {" "}
              {format(settings.amplivaultRequirementStartsAt)} × 1,000
              <sup>x</sup>, where x is the amplivault level
            </span>
          </>
        )}
        {(state.amplivaultLevel.greaterThan(0) || state.everMadeNullith) && (
          <>
            <br />
            Amplivault effect:
            {!state.amplivaultBroken ? (
              <span className="info-effect">
                {" "}
                2<sup>x</sup>, where x is the amplivault level
              </span>
            ) : (
              <span className="info-effect">
                <br />
                if broken: 1.5<sup>x</sup>
                <br />
                Otherwise: 2<sup>x</sup>
                <br />
                Where x is the amplivault level
              </span>
            )}
          </>
        )}
        {(state.boughtEighthVermyrosUpgrade || state.everMadeNullith) && (
          <>
            <br />
            Energy effect:
            <span className="info-effect">
              {" "}
              1.75<sup>log(x + 1)</sup>, where x is energy
            </span>
          </>
        )}
        {state.everReachedCores && (
          <>
            <br />
            Cores:
            <span className="info-effect">
              {" "}
              x / 1,000,000, where x is energy
            </span>
          </>
        )}
        {state.everMadeCoreReset && (
          <>
            <br />
            Core effect:
            <span className="info-effect">
              {" "}
              4<sup>log(x + 1)</sup>
            </span>
            <br />
            Core upgrade cost:
            <span className="info-effect">
              {" "}
              {format(settings.coreUpgradeStartingCost)} ×{" "}
              {format(settings.coreUpgradeCostScaling)}
              <sup>x</sup>, where x is the core upgrade level
            </span>
            <br />
            Core upgrade effect:
            <span className="info-effect">
              {" "}
              {format(settings.coreUpgradeEffectScaling)}
              <sup>x</sup>, where x is the core upgrade level
            </span>
          </>
        )}
        {(state.boughtTenthVermyrosUpgrade || state.everMadeNullith) && (
          <>
            <br />
            Dark energy gain:
            <span className="info-effect">
              {" "}
              2
              <sup>
                log<sub>1e10</sub>(x /{" "}
                {format(settings.tenthVermyrosUpgradeCost)})
              </sup>
              , where x is points
            </span>
            <br />
            Dark energy effect:
            <span className="info-effect">
              {" "}
              1.75<sup>log(x + 1)</sup>, where x is dark energy
            </span>
          </>
        )}
        {state.everMadeNullith && (
          <>
            <br />
            Nullith resets made first effect:
            <span className="info-effect">
              {" "}
              125 × x<sup>3</sup>, where x is nullith resets
            </span>
            <br />
            Nullith resets made second effect:
            <span className="info-effect">
              {" "}
              (x + 1)<sup>1.2</sup>, where x is nullith resets
            </span>
            <br />
            Nullith resets made third effect:
            <span className="info-effect">
              {" "}
              (x + 1)<sup>0.75</sup>, where x is nullith resets
            </span>
          </>
        )}
        {state.boughtFourthNullithUpgrade && (
          <>
            <br />
            Nullion effect:
            <span className="info-effect">
              {" "}
              min(1.1 + log(max(x / 100,000, 0) + 1) / 8, 3)
              <sup>log(max(x, 0) + 1)</sup>, where x is nullions
            </span>
          </>
        )}
        {state.everEnteredSliph && (
          <>
            <br />
            Dertoint effect:
            <span className="info-effect">
              {" "}
              1 + log(max(x × 100, 0) + 1) / 2.5, where x is dertoints
            </span>
            <br />
            Dertoint Upgrade cost:
            <span className="info-effect">
              {" "}
              {format(settings.dertointUpgradeStartingCost)} ×{" "}
              {format(settings.dertointUpgradeCostScaling)}
              <sup>x</sup>, where x is the dertoint upgrade level
            </span>
            <br />
            Dertoint Upgrade effect:
            <span className="info-effect">
              {" "}
              {format(settings.dertointUpgradeEffectScaling)}
              <sup>x</sup>
            </span>
            <br />
            Dertoint Upgrade 1 effect:
            <span className="info-effect">
              {" "}
              1.15
              <sup>
                log<sub>1e5</sub>(max(x / 1e1000, 0) + 1)
              </sup>
              , where x is points
            </span>
          </>
        )}
        {state.everMadeMallirt && (
          <>
            <br />
            Mallirt effect:
            <span className="info-effect">
              {" "}
              3<sup>log(max(x / 133456, 0) + 1)</sup>
            </span>
          </>
        )}
      </p>
      <p>
        Current endgame:{" "}
        <span className="spoiler">{format(settings.endgameAt)}</span>{" "}
        <span className="info-effect">(hover to see)</span>
      </p>
      <p>
        If you find a bug, please report it to Troxi, the developer of the game
      </p>
    </>
  );
}

export default MenuInfo;
