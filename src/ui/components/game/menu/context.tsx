import type { MenuContextValue } from "./types";
import { createContext } from "react";

export const MenuContext = createContext<MenuContextValue | null>(null);
