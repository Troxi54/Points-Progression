import { ClassName } from "@/core/types/react";
import { ComponentType, ReactNode } from "react";

interface MenuInfoPage {
  buttonContent: ReactNode;
  buttonClassName?: ClassName;
  content: ComponentType;
}

export type MenuInfoPages = MenuInfoPage[];
