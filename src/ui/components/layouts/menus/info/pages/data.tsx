import Image from "@/ui/components/base/Image";
import MenuInfoMainPage from "./main";
import { MenuInfoPages } from "./types";
import starIcon from "@ui/assets/star.svg";
import MenuInfoNotationPage from "./notation";
import MenuInfoFormulaPage from "./formulas";

const menuInfoPages: MenuInfoPages = [
  {
    buttonContent: <Image name="Main" src={starIcon}></Image>,
    buttonClassName: "image-button h-[3.25em]",
    content: MenuInfoMainPage
  },
  {
    buttonContent: <p>Notation</p>,
    content: MenuInfoNotationPage
  },
  {
    buttonContent: <p>Formulas</p>,
    content: MenuInfoFormulaPage
  }
];

export default menuInfoPages;
