import { addUncountableRule } from "pluralize";

const uncountables = ["ampliflux", "energy", "dark energy", "vermora"] as const;

export function addUncountableWords() {
  uncountables.forEach((word) => {
    addUncountableRule(word);
  });
}
