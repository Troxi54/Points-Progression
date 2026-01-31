import { addUncountableRule } from "pluralize";
import uncountableWords from "./uncountables";

function addUncountableWords() {
  uncountableWords.forEach((word) => {
    addUncountableRule(word);
  });
}

export default function setupPluralizeRules() {
  addUncountableWords();
}
