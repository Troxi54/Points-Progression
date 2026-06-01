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
        "bg-transparent justify-evenly px-[2em] overflow-x-auto gap-[5%] items-center",
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
