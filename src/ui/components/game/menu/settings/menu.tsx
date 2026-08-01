import type { CSSProperties } from "react";
import cn from "@core/utils/tailwind";
import { savePlayer } from "@game/player/persistence/save";
import { togglePlayerField } from "@game/player/utils";
import resetLayerConfig from "@game/resetLayers/config";
import Button from "@ui/components/base/Button";
import Stack from "@ui/components/base/Stack";
import StatusText from "@ui/components/base/StatusText";
import Tooltip from "@ui/components/base/Tooltip";
import { useMenu } from "@ui/hooks/useMenu";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useEffect, useState } from "react";
import Overlay from "../overlay";
import { NumberNotation } from "@core/format/types";
import Select from "@ui/components/base/Select";
import { getPlayerState } from "@game/player/store";

const SettingsMenu = () => {
  const { open } = useMenu();

  const state = usePlayerFields({
    player: [
      "autosave",
      "hideBoughtUpgrades",
      "numberNotation",
      "saveBeforeUnload",
      "stableProgressBars",
      "offlineProgressWorks",
      "menuBackgroundBlur",
    ],
  });

  const SAVE_BUTTON_TRANSITION_DURATION = 300;

  const [saveState, setSaveState] = useState<"idle" | "saving" | "returning">(
    "idle",
  );

  useEffect(() => {
    if (saveState === "idle") return;
    const t = setTimeout(
      setSaveState,
      SAVE_BUTTON_TRANSITION_DURATION,
      saveState === "saving" ? "returning" : "idle",
    );
    return () => clearTimeout(t);
  }, [saveState]);

  return (
    <Overlay menuId="settings">
      <Button
        variant="menu"
        size="xl"
        className={cn(
          "transition-[scale,background,color] [&>span]:transition-opacity",
          saveState !== "idle" &&
            "duration-(--duration) [&>span]:duration-(--duration)",
          saveState === "saving" &&
            "bg-positive-menu-button-bg hover:bg-positive-menu-button-bg-hover text-positive-menu-button-text scale-110",
        )}
        style={
          {
            "--duration": `${SAVE_BUTTON_TRANSITION_DURATION}ms`,
          } as CSSProperties
        }
        onClick={() => {
          savePlayer();
          setSaveState("saving");
        }}
      >
        <span style={{ opacity: saveState === "saving" ? 0 : 1 }}>Save</span>
        <span
          className="absolute"
          style={{ opacity: saveState === "saving" ? 1 : 0 }}
        >
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
        <Select<NumberNotation>
          id="number-notation-select"
          label="Number notation"
          onChange={(e) => {
            const value = e.target.value as NumberNotation;

            const { setPlayer } = getPlayerState();
            setPlayer({
              numberNotation: value,
            });
          }}
          value={state.numberNotation}
          options={[
            { value: "standard", label: "Standard" },
            { value: "legacy", label: "Legacy" },
            { value: "scientific", label: "Scientific" },
          ]}
        />
        {/* <Button
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
        </Button> */}
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
