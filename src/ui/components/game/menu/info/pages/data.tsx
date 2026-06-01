import type { MenuInfoPages } from "./types";
import starIcon from "@ui/assets/star.svg";
import Image from "@ui/components/base/Image";
import MenuInfoFormulaPage from "./formulas";
import MenuInfoMainPage from "./main";
import MenuInfoNotationPage from "./notation";

const menuInfoPages: MenuInfoPages = [
  {
    buttonContent: <Image className="h-full" alt="Main" src={starIcon}></Image>,
    buttonClassName: "p-0 h-[3.25em]",
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
