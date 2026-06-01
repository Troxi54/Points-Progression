import type { ClassName } from "@core/types/react";
import type { CSSProperties, ReactNode } from "react";
import type { MenuId } from "./types";
import cn from "@core/utils/tailwind";
import { useMenu } from "@ui/hooks/useMenu";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import Container from "@ui/components/base/Container";
import Stack from "@ui/components/base/Stack";

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

function Overlay({
  menuId,
  children,
  overlayChildren,
  menuChildren,
  menuClassName,
  containerClassName,
  blockClosing,
}: OverlayProps) {
  const { menuBackgroundBlur } = usePlayerFields({
    player: ["menuBackgroundBlur"],
  });

  const { close, stack, isOpen, isTop } = useMenu();
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const currentlyOpen = isOpen(menuId);
  const shouldBlockClosing = blockClosing === undefined ? false : blockClosing;

  useEffect(() => {
    if (currentlyOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      setShouldRender(true);
      requestAnimationFrame(() => {
        setVisible(true);

        const firstFocusable = menuContentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setShouldRender(false);

        if (previouslyFocusedRef.current) {
          previouslyFocusedRef.current.focus();
        }
      }, TRANSITION_TIME);
      return () => clearTimeout(t);
    }
  }, [currentlyOpen]);

  const onPointerDown = useEffectEvent((e: PointerEvent) => {
    const overlay = overlayRef.current;
    const isTargetInside = overlay?.contains(e.target as Node);
    if (
      overlay &&
      ((!isTargetInside && isTop(menuId)) || overlay === e.target) &&
      !shouldBlockClosing
    ) {
      close(menuId);
    }
  });

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && isTop(menuId) && !shouldBlockClosing) {
      e.preventDefault();
      close(menuId);
    }
  });

  useEffect(() => {
    if (!visible) return;

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, isTop, shouldBlockClosing]);

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
    <Container
      id={menuId}
      ref={overlayRef}
      role="presentation"
      className={cn(
        "fixed items-center bg-overlay-2 ease-[ease] transition-opacity duration-150 text-[1.5vmin] inset-0",
        menuBackgroundBlur && "backdrop-blur-[0.25em]",
      )}
      style={overlayStyle}
      aria-hidden={!visible}
    >
      {overlayChildren}
      <Container
        ref={menuContentRef}
        role="dialog"
        aria-modal="true"
        aria-label={menuId}
        className={cn(
          "relative size-fit items-center p-[3em] text-[1.1em] bg-overlay-menu rounded-[2em] shadow-[0_0_1.5em_1em_rgba(0,0,0,0.25)]",
          menuBackgroundBlur && "backdrop-blur-[0.1em]",
          menuClassName,
        )}
        style={innerStyle}
      >
        {menuChildren}
        <Stack col className={containerClassName}>
          {children}
        </Stack>
      </Container>
    </Container>
  );
}

export default Overlay;
