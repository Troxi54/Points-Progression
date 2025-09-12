export function toPastSense(str: string) {
  if (str.endsWith("e")) return str + "d";
  return str + "ed";
}

export function isNumberStringDecimal(str: string) {
  return str.toLowerCase().includes("e");
}
