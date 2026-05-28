import type { MenuInfoPages } from "./types";
import starIcon from "@ui/assets/star.svg";
import Image from "@ui/components/base/Image";
import MenuInfoFormulaPage from "./formulas";
import MenuInfoMainPage from "./main";
import MenuInfoNotationPage from "./notation";
import Paragraph from "@ui/components/base/Paragraph";

const menuInfoPages: MenuInfoPages = [
  {
    buttonContent: <Image name="Main" src={starIcon}></Image>,
    buttonClassName: "image-button h-[3.25em]",
    content: MenuInfoMainPage,
  },
  {
    buttonContent: <Paragraph>Notation</Paragraph>,
    content: MenuInfoNotationPage,
  },
  {
    buttonContent: <Paragraph>Formulas</Paragraph>,
    content: MenuInfoFormulaPage,
  },
];

export default menuInfoPages;
