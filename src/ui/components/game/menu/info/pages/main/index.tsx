import gameConfig from "@core/config/data";
import { gameVersionToString } from "@core/utils/version";
import discordIcon from "@ui/assets/discord.svg";
import githubIcon from "@ui/assets/github.svg";
import patreonIcon from "@ui/assets/patreon.svg";
import Button from "@ui/components/base/Button";
import Caption from "@ui/components/base/Caption";
import Heading from "@ui/components/base/Heading";
import Image from "@ui/components/base/Image";
import Link from "@ui/components/base/Link";
import List from "@ui/components/base/List";
import Paragraph from "@ui/components/base/Paragraph";
import Stack from "@ui/components/base/Stack";
import MenuInfoMainPageGameProgress from "./endgame";

function MenuInfoMainPage() {
  return (
    <>
      <Heading level={2} className="m-0">
        {gameConfig.gameName}
      </Heading>
      <Paragraph>
        This is a slow-paced game designed to last several months. New features
        unlock gradually as you progress.
      </Paragraph>
      <Paragraph>
        Before you start, there are a few important things to know:
      </Paragraph>
      <List>
        <li>
          When buying a repeatable upgrade, you only pay for the last level.
        </li>
        <li>
          If a cost or effect does not specify a currency, it uses points.
        </li>
        <li className="text-important">
          Export your save regularly. Clearing browser data or encountering a
          bug may reset your progress.
        </li>
      </List>
      <Stack col className="mt-[2em] gap-[0.75em]">
        <Paragraph className="m-0">
          <Caption>Version: </Caption>
          {gameVersionToString(gameConfig.gameVersion)}
          <br />
          <MenuInfoMainPageGameProgress />
        </Paragraph>
        <Paragraph className="m-0">
          <Caption>Made by </Caption>Troxi
        </Paragraph>
      </Stack>

      <Stack className="mt-[2em]">
        <Button variant="link" size="xl" asChild>
          <Link
            title="Discord server"
            href="https://discord.gg/YT8R2szHXX"
            className="bg-discord hover:bg-discord-hover"
          >
            <span>Discord</span>
            <Image alt="Discord" src={discordIcon} />
          </Link>
        </Button>

        <Button variant="link" size="xl" asChild>
          <Link
            title="GitHub repository"
            href="https://github.com/Troxi54/Points-Progression"
            className="bg-github hover:bg-github-hover"
          >
            <span>GitHub</span>
            <Image alt="GitHub" src={githubIcon} />
          </Link>
        </Button>

        <Button variant="link" size="xl" asChild>
          <Link
            title="Patreon"
            href="https://patreon.com/Troxi"
            className="bg-patreon hover:bg-patreon-hover"
          >
            <span>Patreon</span>
            <Image alt="Patreon" src={patreonIcon} />
          </Link>
        </Button>
      </Stack>
    </>
  );
}

export default MenuInfoMainPage;
