import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useMenu } from "./provider";
import { MenuId } from "./types";
import { ClassName } from "@/core/types/react";
import cn from "@/core/utils/tailwind";
import VerticalContainer from "@/ui/components/base/VerticalContainer";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

const TRANSITION_TIME = 150;

interface OverlayProps {
  menuId: MenuId;
  children?: ReactNode;
  overlayChildren?: ReactNode;
  menuChildren?: ReactNode;
  menuClassName?: ClassName;
  containerClassName?: ClassName;
  blockClosing?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({
  menuId,
  children,
  overlayChildren,
  menuChildren,
  menuClassName,
  containerClassName,
  blockClosing,
}) => {
  const { menuBackgroundBlur } = usePlayerFields({
    player: ["menuBackgroundBlur"],
  });

  const { close, stack, isOpen, isTop } = useMenu();
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const currentlyOpen = isOpen(menuId);
  const shouldBlockClosing = blockClosing === undefined ? false : blockClosing;

  useEffect(() => {
    if (currentlyOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setShouldRender(false), TRANSITION_TIME);
      return () => clearTimeout(t);
    }
  }, [currentlyOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const overlay = ref.current;
      const isTargetInside = overlay?.contains(e.target as Node);
      if (
        overlay &&
        ((!isTargetInside && isTop(menuId)) || overlay === e.target) &&
        !shouldBlockClosing
      ) {
        close(menuId);
      }
    };
    if (visible) {
      document.addEventListener("pointerdown", handler);
    }

    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, [visible, menuId]);

  const position = stack.findIndex((menu) => menu === menuId);
  const zIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (position !== -1 && zIndexRef.current === null) {
      zIndexRef.current = 100 + position * 10;
    }

    if (!shouldRender) {
      zIndexRef.current = null;
    }
  }, [position, shouldRender]);

  if (!shouldRender) return null;

  const overlayStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${TRANSITION_TIME}ms ease-out`,
    zIndex: zIndexRef.current ?? 0,
  };

  const innerStyle: CSSProperties = {
    transform: `translateY(${visible ? "0%" : "-5%"})`,
    transition: `transform ${TRANSITION_TIME}ms ease-out`,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "fixed bg-overlay-2 transition-ease transition-opacity duration-150 text-[1.5vmin] inset-0",
        menuBackgroundBlur && "backdrop-blur-[0.25em]",
      )}
      style={overlayStyle}
    >
      {overlayChildren}
      <div
        className={cn(
          "relative size-fit p-[3em] text-[1.1em] bg-overlay-menu rounded-[2em] shadow-[0_0_1.5em_1em_rgba(0,0,0,0.25)]",
          menuBackgroundBlur && "backdrop-blur-[0.1em]",
          menuClassName,
        )}
        style={innerStyle}
      >
        {menuChildren}
        <VerticalContainer className={cn(containerClassName)}>
          {children}
        </VerticalContainer>
      </div>
    </div>
  );
};

export default Overlay;
