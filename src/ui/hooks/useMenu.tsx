import { MenuContext } from "@ui/components/game/menu/context";
import { use } from "react";

export const useMenu = () => {
  const ctx = use(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
};
