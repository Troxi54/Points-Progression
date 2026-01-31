import { DecimalSource } from "break_eternity.js";
import pluralize from "pluralize";
import { formatNumber, integerCommaFormat } from "./number";

function pluralFormat(
  count: DecimalSource,
  start: string,
  word: string,
  between: string = " ",
) {
  return (start + between + pluralize(word, +count)).trimEnd();
}

export function formatWithPlural(
  count: DecimalSource,
  word: string,
  between: string = " ",
) {
  return pluralFormat(count, formatNumber(count), word, between);
}

export function integerFormatWithPlural(
  count: DecimalSource,
  word: string,
  between: string = " ",
) {
  return pluralFormat(count, integerCommaFormat(count), word, between);
}

/**
 * @returns first the number, then the word
 */
export function splitFormatWithPlural(
  count: DecimalSource,
  word: string,
): [string, string] {
  return [formatNumber(count), pluralize(word, +count, false)];
}
