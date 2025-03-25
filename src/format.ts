import Decimal, { DecimalSource } from "break_eternity.js";

export function format(num: DecimalSource, precision: number | "auto" = "auto"): string {
  num = new Decimal(num);
  if (num.equals(0)) return '0';
  if (num.lessThan(1) && num.greaterThan(-1)) {
    if (precision === "auto")
      precision = 2;
    return num.toFixed(precision);
  }
  if ((num.greaterThanOrEqualTo(1000) || num.lessThanOrEqualTo(-1000)) && precision === 0) {
    precision = 'auto';
  }
  let precisionWasAuto = false;
  if (precision === "auto") {
    precisionWasAuto = true;
    precision = +num.dividedBy(Decimal.pow(1000, num.abs().log10().dividedBy(3).floor()));
    precision = 3 - Math.floor(Math.log10(precision));
  }
  const units = ['', 'k', 'M', 'B', 'T']; 
  let index = num.abs().log10().dividedBy(3).floor();
  index = Decimal.min(units.length - 1, index);
  let divided = num.dividedBy(Decimal.pow(1000, index));
  if (divided.greaterThanOrEqualTo(1e6)) {
    const units2 = ['', 'U', 'U+', 'U++', 'A', 'A+', 'A++',
                    'C', 'C+', 'C++', 'S', 'S+', 'S++',
                    'O', 'O+', 'O++', 'N', 'N+', 'N++',
                    'D', 'D+', 'D++', 'L', 'L+', 'L++',
                    'OP', 'OP+', 'OP++', 'OP*', 'OP**', 'OP^',
                    'OP^^', 'i'];
    index = divided.abs().log10().dividedBy(6).floor();
    index = Decimal.min(units2.length - 1, index);
    divided = divided.dividedBy(Decimal.pow(1e6, index));
    if (divided.greaterThanOrEqualTo(1e9)) {
      if (precisionWasAuto)
        precision = 2;
      const mantissa = num.mantissa;
      const exponent = num.exponent;
      return `${mantissa.toFixed(precision)}e${exponent}`;
    }
    if (divided.greaterThanOrEqualTo(1000))
      return (+divided.floor()).toLocaleString('en-US') + units2[+index];
    return divided.toFixed(precision) + units2[+index];
  }
  if (divided.greaterThanOrEqualTo(1000))
    return (+divided.floor()).toLocaleString('en-US') + units[+index];
  return divided.toFixed(precision) + units[+index];
}

export function formatTime(milliseconds: DecimalSource): string {
  milliseconds = new Decimal(milliseconds);
  const seconds = milliseconds.dividedBy(1000);
  const minutes = seconds.dividedBy(60);
  const hours = minutes.dividedBy(60);
  const days = hours.dividedBy(24);
  const years = days.dividedBy(365);

  if (years.greaterThanOrEqualTo(1000)) {
    return `${format(years.floor())}y`;
  }
  if (years.greaterThanOrEqualTo(10)) {
    return `${years.floor()}y`;
  }
  if (days.greaterThanOrEqualTo(10)) {
    return `${days.floor()}d`;
  }
  if (hours.greaterThanOrEqualTo(1)) {
    const Minutes: Decimal = minutes.mod(60).floor();
    const Seconds: Decimal = seconds.mod(60).floor();
    return `${hours.floor()}h${Minutes.equals(0) ? '' : `. ${Minutes}m`}${Seconds.equals(0) ? '' : `. ${Seconds}s`}`;
  }
  if (minutes.greaterThanOrEqualTo(1)) {
    const Seconds: Decimal = seconds.mod(60).floor();
    return `${minutes.floor()}m${Seconds.equals(0) ? '' : `. ${Seconds}s`}`;
  }
  if (seconds.greaterThanOrEqualTo(1)) {
    return `${seconds.toFixed(3)}s`;
  }
  return `${milliseconds.floor()}ms`;
}

export function formatLeftTime(milliseconds: DecimalSource) {
  milliseconds = new Decimal(milliseconds);
  if (milliseconds.lessThanOrEqualTo(0)) return 'Ready';
  if (milliseconds.greaterThanOrEqualTo('e25')) return 'Never';
  return formatTime(milliseconds);
}