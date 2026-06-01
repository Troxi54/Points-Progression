import type { CSSProperties } from "react";
import { formatNumber } from "@core/format/number";
import { exponentialNotationSettingStartsWorkingAt } from "@core/format/units";
import cn from "@core/utils/tailwind";
import { savePlayer } from "@game/player/persistence/save";
import { togglePlayerField } from "@game/player/utils";
import resetLayerConfig from "@game/resetLayers/config";
import StatusText from "@ui/components/base/StatusText";
import Tooltip from "@ui/components/base/Tooltip";
import { useMenu } from "@ui/hooks/useMenu";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useEffect, useState } from "react";
import Overlay from "../overlay";
import Button from "@ui/components/base/Button";
import Stack from "@ui/components/base/Stack";

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
      <Button
        variant="menu"
        size="xl"
        className={cn(
          "transition-[scale,background,color] duration-(--duration) [&>span]:transition-opacity [&>span]:duration-(--duration)",
          isSaving &&
            "bg-positive-menu-button-bg hover:bg-positive-menu-button-bg-hover text-positive-menu-button-text scale-110",
        )}
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
        <span style={{ opacity: isSaving ? 0 : 1 }}>Save</span>
        <span className="absolute" style={{ opacity: isSaving ? 1 : 0 }}>
          Saved!
        </span>
      </Button>
      <Stack className="mb-[1em]">
        <Button
          variant="menu"
          aria-label="Toggle auto save"
          onClick={() => togglePlayerField("autosave")}
        >
          <span>
            Auto save: <StatusText active={state.autosave} />
          </span>
        </Button>
        <Button
          variant="menu"
          aria-label="Toggle save on exit"
          onClick={() => togglePlayerField("saveBeforeUnload")}
        >
          <span>
            Save on exit: <StatusText active={state.saveBeforeUnload} />
          </span>
        </Button>
      </Stack>
      <Stack className="mb-[1em]">
        <Button
          variant="menu"
          size="xl"
          aria-label="Open Import menu"
          onClick={() => open("settings/import")}
        >
          Import
        </Button>
        <Button
          variant="menu"
          size="xl"
          aria-label="Open Export menu"
          onClick={() => open("settings/export")}
        >
          Export
        </Button>
      </Stack>
      <Stack>
        <Button
          variant="menu"
          aria-label="Toggle hide bought upgrades"
          onClick={() => togglePlayerField("hideBoughtUpgrades")}
        >
          <span>
            Hide bought upgrades:{" "}
            <StatusText active={state.hideBoughtUpgrades} />
          </span>
        </Button>
        <Button
          variant="menu"
          aria-label="Toggle exponential notation"
          onClick={() => togglePlayerField("exponentialNotation")}
        >
          <span>
            Exponential notation:{" "}
            <StatusText active={state.exponentialNotation} />
          </span>
          <Tooltip>
            Still doesn't work for numbers less than{" "}
            {formatNumber(exponentialNotationSettingStartsWorkingAt)}
          </Tooltip>
        </Button>
        <Button
          variant="menu"
          aria-label="Toggle stable progress bars"
          onClick={() => togglePlayerField("stableProgressBars")}
        >
          <span>
            Stable progress bars:{" "}
            <StatusText active={state.stableProgressBars} />
          </span>
          <Tooltip>
            Prevents rapid updates of progress bars when resets per second
            exceed {resetLayerConfig.progressBarsStartLockingAt} by locking them
            at 100%. Helps reduce potential screen wear
          </Tooltip>
        </Button>
      </Stack>
      <Stack>
        <Button
          variant="menu"
          aria-label="Toggle offline progress"
          onClick={() => togglePlayerField("offlineProgressWorks")}
        >
          <span>
            Offline progress: <StatusText active={state.offlineProgressWorks} />
          </span>
        </Button>
        <Button
          variant="menu"
          aria-label="Toggle menu blur"
          onClick={() => togglePlayerField("menuBackgroundBlur")}
        >
          <span>
            Menu background blur:{" "}
            <StatusText active={state.menuBackgroundBlur} />
          </span>
        </Button>
      </Stack>
    </Overlay>
  );
};

export default SettingsMenu;
