import type { CSSProperties } from "react";
import { formatNumber } from "@core/format/number";
import { exponentialNotationSettingStartsWorkingAt } from "@core/format/units";
import cn from "@core/utils/tailwind";
import { savePlayer } from "@game/player/persistence/save";
import { togglePlayerField } from "@game/player/utils";
import resetLayerConfig from "@game/resetLayers/config";
import HorizontalContainer from "@ui/components/base/HorizontalContainer";
import StatusText from "@ui/components/base/StatusText";
import Tooltip from "@ui/components/base/Tooltip";
import { useMenu } from "@ui/hooks/useMenu";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useEffect, useState } from "react";
import Overlay from "../overlay";
import Paragraph from "@ui/components/base/Paragraph";

const SettingsMenu = () => {
  const { open } = useMenu();

  const state = usePlayerFields({
    player: [
      "autosave",
      "hideBoughtUpgrades",
      "exponentialNotation",
      "saveBeforeUnload",
      "stableProgressBars",
      "offlineProgressWorks",
      "menuBackgroundBlur",
    ],
  });

  const SAVE_BUTTON_TRANSITION_DURATION = 300;

  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (isSaving) {
      const timeout = setTimeout(() => {
        setIsSaving(false);
      }, SAVE_BUTTON_TRANSITION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isSaving]);

  return (
    <Overlay menuId="settings">
      <button
        className={cn("menu-button big save-button", isSaving && "saved")}
        style={
          {
            "--duration": `${SAVE_BUTTON_TRANSITION_DURATION}ms`,
          } as CSSProperties
        }
        onClick={() => {
          savePlayer();
          setIsSaving(true);
        }}
      >
        <Paragraph style={{ opacity: isSaving ? 0 : 1 }}>Save</Paragraph>
        <Paragraph className="absolute" style={{ opacity: isSaving ? 1 : 0 }}>
          Saved!
        </Paragraph>
      </button>
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Toggle auto save"
          onClick={() => togglePlayerField("autosave")}
        >
          <Paragraph>
            Auto save: <StatusText active={state.autosave} />
          </Paragraph>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle save on exit"
          onClick={() => togglePlayerField("saveBeforeUnload")}
        >
          <Paragraph>
            Save on exit: <StatusText active={state.saveBeforeUnload} />
          </Paragraph>
        </button>
      </HorizontalContainer>
      <div />
      <HorizontalContainer>
        <button
          className="menu-button big"
          aria-label="Open Import menu"
          onClick={() => open("settings/import")}
        >
          <Paragraph>Import</Paragraph>
        </button>
        <button
          className="menu-button big"
          aria-label="Open Export menu"
          onClick={() => open("settings/export")}
        >
          <Paragraph>Export</Paragraph>
        </button>
      </HorizontalContainer>
      <div />
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Toggle hide bought upgrades"
          onClick={() => togglePlayerField("hideBoughtUpgrades")}
        >
          <Paragraph>
            Hide bought upgrades:{" "}
            <StatusText active={state.hideBoughtUpgrades} />
          </Paragraph>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle exponential notation"
          onClick={() => togglePlayerField("exponentialNotation")}
        >
          <Paragraph>
            Exponential notation:{" "}
            <StatusText active={state.exponentialNotation} />
          </Paragraph>
          <Tooltip>
            Still doesn't work for numbers less than{" "}
            {formatNumber(exponentialNotationSettingStartsWorkingAt)}
          </Tooltip>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle stable progress bars"
          onClick={() => togglePlayerField("stableProgressBars")}
        >
          <Paragraph>
            Stable progress bars:{" "}
            <StatusText active={state.stableProgressBars} />
          </Paragraph>
          <Tooltip>
            Prevents rapid updates of progress bars when resets per second
            exceed {resetLayerConfig.progressBarsStartLockingAt} by locking them
            at 100%. Helps reduce potential screen wear
          </Tooltip>
        </button>
      </HorizontalContainer>
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Toggle offline progress"
          onClick={() => togglePlayerField("offlineProgressWorks")}
        >
          <Paragraph>
            Offline progress: <StatusText active={state.offlineProgressWorks} />
          </Paragraph>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle menu blur"
          onClick={() => togglePlayerField("menuBackgroundBlur")}
        >
          <Paragraph>
            Menu background blur:{" "}
            <StatusText active={state.menuBackgroundBlur} />
          </Paragraph>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
};

export default SettingsMenu;
