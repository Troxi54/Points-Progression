import type { FormatNumberGroupContainer, NumberNotation, Unit } from "./types";
import createDecimal from "@core/utils/decimal";
import { objectEntries } from "@core/utils/object";
import Decimal from "break_eternity.js";

const numberNotations: FormatNumberGroupContainer = {
  standard: [
    {
      scaling: "1e3",
      units: [
        '',
        "k",
        "M",
        "B",
        "T",
        "Qa",
        "Qi",
        "Sx",
        "Sp",
        "Oc",
        "No",
        "Dc",
        "Ud",
        "Dd",
        "Td",
        "Qad",
        "Qid",
        "Sxd",
        "Spd",
        "Ocd",
        "Nod",
        "Vg",
        "Uvg",
        "Dvg",
        "Tvg",
        "Qavg",
        "Qivg",
        "Sxvg",
        "Spvg",
        "Ocvg",
        "Novg",
        "Tg",
        "Utg",
        "Dtg",
        "Ttg",
        "Qatg",
        "Qitg",
        "Sxtg",
        "Sptg",
        "Octg",
        "Notg",
        "Qd",
        "Uqd",
        "Dqd",
        "Tqd",
        "Qaqd",
        "Qiqd",
        "Sxqd",
        "Spqd",
        "Ocqd",
        "Noqd",
        "Qq",
        "Uqq",
        "Dqq",
        "Tqq",
        "Qaqq",
        "Qiqq",
        "Sxqq",
        "Spqq",
        "Ocqq",
        "Noqq",
        "Sg",
        "Usg",
        "Dsg",
        "Tsg",
        "Qasg",
        "Qisg",
        "Sxsg",
        "Spsg",
        "Ocsg",
        "Nosg",
      ],
    },
  ],
  legacy: [
    {
      scaling: "1e3",
      units: ["", "k", "M", "B"],
    },
    {
      scaling: "1e6",
      units: [
        "T",
        "U",
        "U+",
        "U++",
        "A",
        "A+",
        "A++",
        "C",
        "C+",
        "C++",
        "S",
        "S+",
        "S++",
        "O",
        "O+",
        "O++",
        "N",
        "N+",
        "N++",
        "D",
        "D+",
        "D++",
        "L",
        "L+",
        "L++",
        "OP",
        "OP+",
        "OP++",
        "OP*",
        "OP**",
        "OP^",
        "OP^^",
      ],
    },
    {
      scaling: "1e9",
      units: ["i"],
    },
  ],
};

export default numberNotations;

export const numberNotationUnitLogs: Partial<
  Record<NumberNotation, [Unit, Decimal][]>
> = {};

function buildNotationUnitLogs() {
  for (const [notation, groups] of objectEntries(numberNotations)) {
    if (!groups) continue;

    const result: [Unit, Decimal][] = [];

    let startsAt = createDecimal(1);

    for (const group of groups) {
      for (const unit of group.units) {
        result.push([
          unit,
          startsAt.log10()
        ]);

        startsAt = startsAt.multiply(group.scaling);
      }
    }

    numberNotationUnitLogs[notation] = result;
  }
}

buildNotationUnitLogs();
