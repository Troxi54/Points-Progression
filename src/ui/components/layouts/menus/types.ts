export type MenuId =
  | "offline"
  | "info"
  | "settings"
  | "settings/import"
  | "settings/export";

export interface MenuContextValue {
  stack: MenuId[];
  open: (menu: MenuId) => void;
  close: (menu: MenuId) => void;
  isOpen: (menu: MenuId) => boolean;
  isTop: (menu: MenuId) => boolean;
  closeAll: () => void;
  closeAllExcept: (menu: MenuId) => void;
}
