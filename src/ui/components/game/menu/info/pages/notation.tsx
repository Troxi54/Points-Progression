import { formatConfig } from "@core/format/config";
import { integerCommaFormat } from "@core/format/number";
import { numberNotationUnitLogs } from "@core/format/units";
import Paragraph from "@ui/components/base/Paragraph";
import Pow from "@ui/components/base/Pow";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Decimal from "break_eternity.js";

function MenuInfoNotationPage() {
  const { numberNotation } = usePlayerFields({
    player: ["numberNotation"],
  });

  const unitLogs = numberNotationUnitLogs[numberNotation] ?? [];

  const units = unitLogs.map(([unit, startsAt], index) => {
    if (startsAt.equals(0)) return;

    return (
      <span key={index}>
        1{unit} ={" "}
        {startsAt.lessThan(6) ? (
          <>{integerCommaFormat(Decimal.pow(10, startsAt))}</>
        ) : (
          <>
            10<Pow>{integerCommaFormat(startsAt)}</Pow>
          </>
        )}
        <br />
      </span>
    );
  });

  return (
    <>
      <Paragraph>
        {units}
        <br />
        Scientific notation starts at 10
        <Pow>
          {integerCommaFormat(
            formatConfig.scientificNotationThreshold.log10().floor(),
          )}
        </Pow>
      </Paragraph>
    </>
  );
}

export default MenuInfoNotationPage;
