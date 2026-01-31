import Pow from "@/ui/components/base/Pow";
import { integerCommaFormat } from "@/core/format/number";
import {
  allFormatUnitsLog,
  formatExponentialNotationStartsAtLog
} from "@/core/format/units";
import Decimal from "break_eternity.js";

function MenuInfoNotationPage() {
  const units = allFormatUnitsLog.map(([unit, startsAt], index) => {
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
      <p>
        {units}
        <br />
        Exponential notation starts at 10
        <Pow>{integerCommaFormat(formatExponentialNotationStartsAtLog)}</Pow>
      </p>
    </>
  );
}

export default MenuInfoNotationPage;
