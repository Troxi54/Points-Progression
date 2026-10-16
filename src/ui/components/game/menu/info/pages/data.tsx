import type { MenuInfoPages } from "./types";
import MenuInfoFormulaPage from "./formulas";
import MenuInfoMainPage from "./main";
import MenuInfoNotationPage from "./notation";
import StarIcon from "@ui/components/base/icons/Star";

const menuInfoPages: MenuInfoPages = [
  {
    buttonContent: <StarIcon className="size-7/10" />,
    buttonClassName: "p-0 size-[3.25em]",
    content: MenuInfoMainPage,
  },
  {
    buttonContent: <>Notation</>,
    content: MenuInfoNotationPage,
  },
  {
    buttonContent: <>Formulas</>,
    content: MenuInfoFormulaPage,
  },
];

export default menuInfoPages;
