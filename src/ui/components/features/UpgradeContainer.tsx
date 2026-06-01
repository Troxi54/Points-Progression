import type { ClassName } from "@core/types/react";
import type { UpgradeDataContainer } from "@game/upgrades/types";
import cn from "@core/utils/tailwind";
import Upgrade from "./Upgrade";
import Container from "../base/Container";

interface props {
  id?: string;
  upgradeContainer: UpgradeDataContainer;
  className?: ClassName;
  start?: number;
  end?: number;
}

function UpgradeContainer({
  id,
  upgradeContainer,
  className,
  start,
  end,
}: props) {
  const startsAt = start ? start - 1 : 0;
  return (
    <Container
      id={id}
      className={cn(
        "items-center justify-evenly gap-[5%] overflow-x-auto bg-transparent px-[2em]",
        className,
      )}
    >
      {upgradeContainer.upgrades.slice(startsAt, end).map((upgrade, index) => {
        const upgradeNumber = index + startsAt + 1;
        return (
          <Upgrade
            key={upgrade.id}
            upgradeData={upgrade}
            upgradeContainerData={upgradeContainer}
            upgradeNumber={upgradeNumber}
          />
        );
      })}
    </Container>
  );
}

export default UpgradeContainer;
