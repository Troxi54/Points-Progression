import HorizontalContainer from "@/ui/components/base/HorizontalContainer";
import Overlay from "../overlay";
import menuInfoPages from "./pages/data";
import { useState } from "react";
import cn from "@/core/utils/tailwind";
import VerticalContainer from "@/ui/components/base/VerticalContainer";

const InfoMenu = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const CurrentContent = menuInfoPages[currentPage].content;

  return (
    <Overlay
      menuId="info"
      menuClassName="w-1/2 h-2/3 p-0"
      containerClassName="w-full h-9/10 overflow-x-hidden overflow-y-auto px-[2em]"
      menuChildren={
        <HorizontalContainer className="absolute -translate-y-110/100 top-0 big bg-page-container-bg p-[0.4em] rounded-[0.5em] gap-[0.75em]">
          {menuInfoPages.map((page, index) => (
            <button
              className={cn(
                "menu-button underline-effect-button rounded-[0.75em] bg-page-button-bg hover:bg-page-button-bg-hover",
                currentPage === index && "active",
                page.buttonClassName
              )}
              onClick={() => setCurrentPage(index)}
              key={index}
            >
              {page.buttonContent}
            </button>
          ))}
        </HorizontalContainer>
      }
    >
      <div className="min-h-full justify-start">
        <VerticalContainer className="my-auto">
          {<CurrentContent />}
        </VerticalContainer>
      </div>
    </Overlay>
  );
};

export default InfoMenu;
