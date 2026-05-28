import type { ChildrenProps } from "@core/types/react";
import type { MenuId } from "./types";
import { arrayLastItem } from "@core/utils/array";
import { useEffect, useRef, useState } from "react";
import { MenuContext } from "./context";

export default function MenuProvider({ children }: ChildrenProps) {
  const [stack, setStack] = useState<MenuId[]>([]);
  const stackRef = useRef(stack);

  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);

  const isOpen = (menu: MenuId) => stack.includes(menu);
  const isTop = (menu: MenuId) => arrayLastItem(stackRef.current) === menu;

  function open(menu: MenuId) {
    if (isOpen(menu)) return;

    setStack((prev) => {
      return [...prev, menu];
    });
  }

  function close(menu: MenuId) {
    if (!isOpen(menu)) return;

    setStack((prev) => {
      return prev.filter((value) => value !== menu);
    });
  }

  function closeAll() {
    setStack([]);
  }

  function closeAllExcept(menu: MenuId) {
    setStack((prev) => {
      if (prev.includes(menu)) return [menu];
      return [];
    });
  }

  return (
    <MenuContext
      value={{ stack, open, close, isOpen, isTop, closeAll, closeAllExcept }}
    >
      {children}
    </MenuContext>
  );
}
