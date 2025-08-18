import { CSSProperties, JSX, useEffect, useState } from "react";

const LOADING_MENU_FADE_OUT_DURATION = 350;

interface Props {
  conditionForMainContent: boolean;
  mainContent: JSX.Element;
}

function LoadingMenu({ conditionForMainContent, mainContent }: Props) {
  const [shouldLoadingMenuRender, setShouldLoadingMenuRender] =
    useState<boolean>(!conditionForMainContent);

  useEffect(() => {
    if (conditionForMainContent && shouldLoadingMenuRender) {
      const timeout = setTimeout(() => {
        setShouldLoadingMenuRender(false);
      }, LOADING_MENU_FADE_OUT_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [conditionForMainContent]);

  const menuStyle: CSSProperties = {
    opacity: !conditionForMainContent ? 1 : 0,
    transitionDuration: `${LOADING_MENU_FADE_OUT_DURATION}ms`
  };

  return (
    <>
      {conditionForMainContent && mainContent}
      {shouldLoadingMenuRender && (
        <div
          className="fixed left-0 top-0 z-10 bg-loading-menu-bg w-screen h-screen transition-opacity"
          style={menuStyle}
        >
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
}

export default LoadingMenu;
