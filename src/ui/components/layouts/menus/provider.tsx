import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { MenuContextValue, MenuId } from "./types";
import { arrayLastItem } from "@/core/utils/array";

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
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
    <MenuContext.Provider
      value={{ stack, open, close, isOpen, isTop, closeAll, closeAllExcept }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
};
