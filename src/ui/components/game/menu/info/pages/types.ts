import type { ClassName } from "@core/types/react";
import type { ComponentType, ReactNode } from "react";

interface MenuInfoPage {
  buttonContent: ReactNode;
  buttonClassName?: ClassName;
  content: ComponentType;
}

export type MenuInfoPages = MenuInfoPage[];
