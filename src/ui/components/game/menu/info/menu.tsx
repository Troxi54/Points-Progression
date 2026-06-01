import { useState } from "react";
import Overlay from "../overlay";
import menuInfoPages from "./pages/data";
import Container from "@ui/components/base/Container";
import Stack from "@ui/components/base/Stack";
import UnderlineButton from "@ui/components/base/UnderlineButton";

const InfoMenu = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const CurrentContent = menuInfoPages[currentPage].content;

  return (
    <Overlay
      menuId="info"
      menuClassName="w-1/2 h-2/3 p-0"
      containerClassName="w-full h-9/10 overflow-x-hidden overflow-y-auto px-[2em]"
      menuChildren={
        <Container
          role="tablist"
          className="absolute -translate-y-110/100 top-0 bg-tab-container-bg p-[0.4em] rounded-[0.5em] items-center gap-[0.75em]"
        >
          {menuInfoPages.map((page, index) => (
            <UnderlineButton
              role="tab"
              aria-selected={currentPage === index}
              aria-controls={`tabpanel-${index}`}
              variant="tab"
              size="xl"
              active={currentPage === index}
              className={page.buttonClassName}
              onClick={() => setCurrentPage(index)}
              key={index}
              tabIndex={currentPage === index ? 0 : -1}
            >
              {page.buttonContent}
            </UnderlineButton>
          ))}
        </Container>
      }
    >
      <Container
        id={`tabpanel-${currentPage}`}
        role="tabpanel"
        className="min-h-full"
      >
        <Stack col className="my-auto">
          {<CurrentContent />}
        </Stack>
      </Container>
    </Overlay>
  );
};

export default InfoMenu;
