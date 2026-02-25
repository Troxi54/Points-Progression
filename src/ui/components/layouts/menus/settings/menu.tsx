import { savePlayer } from "@/game/player/persistence/save";
import Overlay from "../overlay";
import { useMenu } from "../provider";
import { togglePlayerField } from "@/game/player/utils";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import StatusText from "@/ui/components/base/StatusText";
import HorizontalContainer from "@/ui/components/base/HorizontalContainer";
import Tooltip from "@/ui/components/base/Tooltip";
import resetLayerConfig from "@/game/resetLayers/config";
import { exponentialNotationSettingStartsWorkingAt } from "@/core/format/units";
import { formatNumber } from "@/core/format/number";
import { CSSProperties, useEffect, useState } from "react";
import cn from "@/core/utils/tailwind";

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
        <p style={{ opacity: isSaving ? 0 : 1 }}>Save</p>
        <p className="absolute" style={{ opacity: isSaving ? 1 : 0 }}>
          Saved!
        </p>
      </button>
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Toggle auto save"
          onClick={() => togglePlayerField("autosave")}
        >
          <p>
            Auto save: <StatusText active={state.autosave} />
          </p>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle save on exit"
          onClick={() => togglePlayerField("saveBeforeUnload")}
        >
          <p>
            Save on exit: <StatusText active={state.saveBeforeUnload} />
          </p>
        </button>
      </HorizontalContainer>
      <div />
      <HorizontalContainer>
        <button
          className="menu-button big"
          aria-label="Open Import menu"
          onClick={() => open("settings/import")}
        >
          <p>Import</p>
        </button>
        <button
          className="menu-button big"
          aria-label="Open Export menu"
          onClick={() => open("settings/export")}
        >
          <p>Export</p>
        </button>
      </HorizontalContainer>
      <div />
      <HorizontalContainer>
        <button
          className="menu-button"
          aria-label="Toggle hide bought upgrades"
          onClick={() => togglePlayerField("hideBoughtUpgrades")}
        >
          <p>
            Hide bought upgrades:{" "}
            <StatusText active={state.hideBoughtUpgrades} />
          </p>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle exponential notation"
          onClick={() => togglePlayerField("exponentialNotation")}
        >
          <p>
            Exponential notation:{" "}
            <StatusText active={state.exponentialNotation} />
          </p>
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
          <p>
            Stable progress bars:{" "}
            <StatusText active={state.stableProgressBars} />
          </p>
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
          <p>
            Offline progress: <StatusText active={state.offlineProgressWorks} />
          </p>
        </button>
        <button
          className="menu-button"
          aria-label="Toggle menu blur"
          onClick={() => togglePlayerField("menuBackgroundBlur")}
        >
          <p>
            Menu background blur:{" "}
            <StatusText active={state.menuBackgroundBlur} />
          </p>
        </button>
      </HorizontalContainer>
    </Overlay>
  );
};

export default SettingsMenu;
