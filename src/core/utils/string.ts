import createDecimal from "./decimal";

export function capitalizeString(str: string): string {
  if (str.length === 0) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function stringIsExponentialDecimal(str: string): boolean {
  const decimalValue = createDecimal(str.toString());
  return (
    !decimalValue.isNan() &&
    decimalValue.isFinite() &&
    str.toLowerCase().includes("e")
  );
}

export function stringIsNumeric(str: string): boolean {
  str = str.trim();
  if (!str) return false;

  return !isNaN(Number(str));
}
