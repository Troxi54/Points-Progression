import gameConfig from "@core/config/data";
import { gameVersionToString } from "@core/utils/version";
import discordIcon from "@ui/assets/discord.svg";
import githubIcon from "@ui/assets/github.svg";
import patreonIcon from "@ui/assets/patreon.svg";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import Image from "@ui/components/base/Image";
import LinkButton from "@ui/components/base/LinkButton";
import VerticalContainer from "@ui/components/base/VerticalContainer";
import MenuInfoMainPageGameProgress from "./endgame";
import Paragraph from "@ui/components/base/Paragraph";
import Heading from "@ui/components/base/Heading";

function MenuInfoMainPage() {
  return (
    <>
      <Heading level={2} className="m-0">
        {gameConfig.gameName}
      </Heading>
      <Paragraph>
        This is a slow-paced game designed to last over a month. New features
        unlock gradually as you progress.
      </Paragraph>
      <Paragraph>
        Before you start, there are a few important things to know:
      </Paragraph>
      <ul className="circle-list">
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
      </ul>
      <VerticalContainer className="mt-[2em] gap-[0.75em]">
        <Paragraph className="m-0">
          <span className="small-text">Version: </span>
          {gameVersionToString(gameConfig.gameVersion)}
          <br />
          <MenuInfoMainPageGameProgress />
        </Paragraph>
        <Paragraph className="m-0">
          <span className="small-text">Made by </span>Troxi
        </Paragraph>
      </VerticalContainer>

      <HorizontalContainer className="mt-[2em]">
        <LinkButton
          name="Discord server"
          link="https://discord.gg/YT8R2szHXX"
          className="menu-button bg-discord hover:bg-discord-hover"
        >
          <Paragraph>Discord</Paragraph>
          <Image name="Discord" src={discordIcon} />
        </LinkButton>

        <LinkButton
          name="GitHub repository"
          link="https://github.com/Troxi54/Points-Progression"
          className="menu-button bg-github hover:bg-github-hover"
        >
          <Paragraph>GitHub</Paragraph>
          <Image name="GitHub" src={githubIcon} />
        </LinkButton>
        <LinkButton
          name="Patreon"
          link="https://patreon.com/Troxi"
          className="menu-button bg-patreon hover:bg-patreon-hover"
        >
          <Paragraph>Patreon</Paragraph>
          <Image name="Patreon" src={patreonIcon} />
        </LinkButton>
      </HorizontalContainer>
    </>
  );
}

export default MenuInfoMainPage;
