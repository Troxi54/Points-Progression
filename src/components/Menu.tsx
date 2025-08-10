import { useEffect, useRef, useState, CSSProperties } from "react";
import discordIcon from "../assets/discord.png";
import { usePlayer, usePlayerStore } from "../player/playerStore";
import {
  getConvertedPlayerData,
  isPlayerDataValid,
  loadAndSetPlayer,
  resetPlayerDataAndGame,
  savePlayerToLocalStorage
} from "../player/playerUtils";
import MenuInfo from "./MenuInfo";
import { Player } from "../player/playerTypes";
import StatusText from "./StatusText";
import { settings } from "../player/settings";
import { toPastSense } from "../utils";

const TRANSITION_TIME = 150;
const TRANSITION = `transform ${TRANSITION_TIME}ms ease-out`;
const TRANSITION_FOR_DATA_BUTTONS = "opacity 250ms linear";
const ACTION_TIMEOUT = 1000;

interface MenuState {
  isOpen: boolean;
  shouldRender: boolean;
}

type MenuType = "main" | "info" | "import" | "export" | "more";

const Menu: React.FC = () => {
  const state = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    hideBoughtUpgrades: state.player.hideBoughtUpgrades,
    exponentialNotation: state.player.exponentialNotation,
    stableProgressBars: state.player.stableProgressBars,
    gameVersion: state.player.gameVersion
  }));

  const { setPlayer } = state;

  const [menuStates, setMenuStates] = useState<Record<MenuType, MenuState>>({
    main: { isOpen: false, shouldRender: false },
    info: { isOpen: false, shouldRender: false },
    import: { isOpen: false, shouldRender: false },
    export: { isOpen: false, shouldRender: false },
    more: { isOpen: false, shouldRender: false }
  });

  const [actionStates, setActionStates] = useState({
    save: { isActive: false, timeoutRef: useRef<number | null>(null) },
    import: { isActive: false, timeoutRef: useRef<number | null>(null) },
    export: { isActive: false, timeoutRef: useRef<number | null>(null) }
  });

  const menuRefs = useRef<
    Record<MenuType, React.RefObject<HTMLDivElement | null>>
  >({
    main: useRef(null),
    info: useRef(null),
    import: useRef(null),
    export: useRef(null),
    more: useRef(null)
  });

  const menuStatesRef = useRef(menuStates);

  useEffect(() => {
    menuStatesRef.current = menuStates;
  }, [menuStates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const currentStates = menuStatesRef.current;

      const isAnyOverlayOpen = (
        ["info", "import", "export", "more"] as MenuType[]
      ).some((menu) => currentStates[menu]?.isOpen);

      (Object.keys(menuRefs.current) as MenuType[]).forEach((menu) => {
        const ref = menuRefs.current[menu];
        if (!ref?.current) return;

        const isClickOutside = !ref.current.contains(event.target as Node);

        if (!currentStates[menu].isOpen) return;

        if (menu === "main" && isAnyOverlayOpen) return;

        if (isClickOutside) {
          setMenuStates((prev) => ({
            ...prev,
            [menu]: { ...prev[menu], isOpen: false }
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: MenuType) => {
    setMenuStates((prev) => ({
      ...prev,
      [menu]: { ...prev[menu], isOpen: !prev[menu].isOpen }
    }));
  };

  const handleAction = (
    action: keyof typeof actionStates,
    callback: () => void
  ) => {
    callback();
    setActionStates((prev) => ({
      ...prev,
      [action]: { ...prev[action], isActive: true }
    }));
    const { timeoutRef } = actionStates[action];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setActionStates((prev) => ({
        ...prev,
        [action]: { ...prev[action], isActive: false }
      }));
    }, ACTION_TIMEOUT);
  };

  const handleImport = (data: string) => {
    if (!isPlayerDataValid(data)) return;
    loadAndSetPlayer(data);
    handleAction("import", () => toggleMenu("import"));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => handleImport(e.target?.result as string);
      reader.readAsText(file);
    } else {
      alert("Wrong file type");
    }
  };

  const handleExport = (toClipboard: boolean) => {
    const { player } = usePlayerStore.getState();
    const encodedData = getConvertedPlayerData(player);
    if (toClipboard) {
      navigator.clipboard
        .writeText(encodedData)
        .then(() => handleAction("export", () => toggleMenu("export")))
        .catch((err) => alert(`Unsuccessful copy to clipboard, ${err}`));
    } else {
      const time = new Date();
      const fileName = `Points Progression ${time
        .toLocaleTimeString()
        .replace(/[:]/g, "-")} ${time
        .toLocaleDateString()
        .replace(/[/]/g, "-")}.txt`;
      const blob = new Blob([encodedData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      handleAction("export", () => toggleMenu("export"));
    }
  };

  const handleSave = () => {
    handleAction("save", savePlayerToLocalStorage);
  };

  const togglePlayerSetting = (key: keyof Player) => {
    const { player } = usePlayerStore.getState();
    setPlayer({ [key]: !player[key] });
  };

  useEffect(() => {
    const timeouts: number[] = [];

    Object.keys(menuStates).forEach((menu) => {
      const key = menu as MenuType;
      const { isOpen, shouldRender } = menuStates[key];

      if (isOpen && !shouldRender) {
        setMenuStates((prev) => ({
          ...prev,
          [key]: { ...prev[key], shouldRender: true }
        }));
      } else if (!isOpen && shouldRender) {
        const timeout = setTimeout(() => {
          setMenuStates((prev) => ({
            ...prev,
            [key]: { ...prev[key], shouldRender: false }
          }));
        }, TRANSITION_TIME);
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [menuStates]);

  const getOverlayStyle = (menu: MenuType): CSSProperties => ({
    visibility: menuStates[menu].shouldRender ? "visible" : "hidden",
    opacity: menuStates[menu].isOpen ? 1 : 0
  });

  const getOverlayDivStyle = (menu: MenuType): CSSProperties => ({
    transform: `translateY(${menuStates[menu].isOpen ? "0%" : "-5%"})`,
    transition: TRANSITION
  });

  const getButtonTextStyle = (
    action: keyof typeof actionStates
  ): CSSProperties => ({
    opacity: actionStates[action].isActive ? 1 : 0,
    transition: TRANSITION_FOR_DATA_BUTTONS,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  });

  const getButtonDefaultTextStyle = (
    action: keyof typeof actionStates
  ): CSSProperties => ({
    opacity: actionStates[action].isActive ? 0 : 1,
    transition: TRANSITION_FOR_DATA_BUTTONS
  });

  const renderMenuButton = (
    label: string,
    action: keyof typeof actionStates,
    onClick: () => void
  ) => (
    <button onClick={onClick}>
      <p className="menu-button-info" style={getButtonTextStyle(action)}>
        {toPastSense(action.charAt(0).toUpperCase() + action.slice(1))}
      </p>
      <p className="menu-button-info" style={getButtonDefaultTextStyle(action)}>
        {label}
      </p>
    </button>
  );

  return (
    <div
      id="main-buttons"
      className="fixed z-10 w-fit h-[8vmin] top-0 right-0 text-[1.6vmin] p-[0.6em] rounded-bl-[1em] justify-start flex-row-reverse gap-[0.5em] bg-main-button-container"
      ref={menuRefs.current.main}
    >
      <button
        id="menu-toggle"
        className="flex flex-col gap-[.6em] items-center justify-center py-[0.5em]"
        onClick={() => toggleMenu("main")}
      >
        <div />
        <div />
        <div />
      </button>
      <div
        id="data-buttons"
        className="absolute w-fit px-[1.2em] py-[0.5em] right-[105%] gap-[2.5%] bg-data-button-container transition-[opacity_transform] transition-ease duration-200 rounded-[1em]"
        style={{
          visibility: menuStates.main.shouldRender ? "visible" : "hidden",
          opacity: menuStates.main.isOpen ? 1 : 0,
          transform: `scaleX(${menuStates.main.isOpen ? "1" : "0"})`,
          transformOrigin: "right"
        }}
      >
        <button onClick={() => toggleMenu("more")}>
          <p className="menu-button-info">More</p>
        </button>
        {renderMenuButton("Save", "save", handleSave)}
        {renderMenuButton("Import", "import", () => toggleMenu("import"))}
        {renderMenuButton("Export", "export", () => toggleMenu("export"))}
      </div>
      <div className="overlay text-[1.6vmin]" style={getOverlayStyle("more")}>
        <div
          className="overlay-div w-fit h-fit p-[5em]"
          style={getOverlayDivStyle("more")}
          ref={menuRefs.current.more}
        >
          <div className="gap-[2em] flex-col w-fit h-fit overflow-y-auto">
            <div className="more-menu-row">
              <button
                className="more-menu-button"
                onClick={() => togglePlayerSetting("hideBoughtUpgrades")}
              >
                <p className="menu-button-info">
                  Hide bought upgrades:{" "}
                  <StatusText active={state.hideBoughtUpgrades} />
                </p>
              </button>
              <button
                className="more-menu-button"
                onClick={() => togglePlayerSetting("exponentialNotation")}
              >
                <p className="menu-button-info">
                  Exponential notation:{" "}
                  <StatusText active={state.exponentialNotation} />
                </p>
              </button>
              <button
                className="more-menu-button"
                onClick={() => togglePlayerSetting("stableProgressBars")}
              >
                <p className="menu-button-info">
                  Stable progress bars:{" "}
                  <StatusText active={state.stableProgressBars} />
                </p>
                <div className="tooltip-trigger">?</div>
                <div className="tooltip">
                  <p>
                    Prevents rapid updates of progress bars when resets per
                    second exceed {settings.stableProgressBarsStartWorkingAt} by
                    locking them at 100%. Helps reduce potential screen wear
                  </p>
                </div>
              </button>
            </div>
            <p>
              Points Progression <span className="info-effect">by</span> Troxi
              <br />
              <span className="info-effect">Version:</span> {state.gameVersion}
            </p>
            <div className="more-menu-row">
              <a
                className="more-menu-button px-[1.2em] py-[0.5em] flex flex-row justify-center items-center gap-[0.5em] box-border bg-discord-button hover:bg-discord-button-hovered"
                href="https://discord.gg/YT8R2szHXX"
                target="_blank"
              >
                <p className="menu-button-info">Discord</p>
                <img
                  src={discordIcon}
                  className="h-[1em] w-[initial]"
                  alt="Discord"
                  draggable="false"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="overlay" style={getOverlayStyle("import")}>
        <div
          className="overlay-div data-div"
          style={getOverlayDivStyle("import")}
          ref={menuRefs.current.import}
        >
          <h1>Import</h1>
          <div className="data-action-container">
            <button
              onClick={() => {
                const userText = prompt(
                  "Enter your save data here. The current data will be lost."
                );
                if (userText) handleImport(userText);
              }}
            >
              <p className="menu-button-info">From text</p>
            </button>
            <button
              onClick={() =>
                document.getElementById("import-from-file")?.click()
              }
            >
              <p className="menu-button-info">From file</p>
              <input
                id="import-from-file"
                type="file"
                hidden
                onChange={handleFileChange}
                accept="text/plain"
              />
            </button>
            <button
              className="bg-reset-data-button hover:bg-reset-data-button-hovered"
              onClick={() => {
                const userText = prompt(
                  "Warning: This will permanently clear your progress. Type 'confirm' (any case) to proceed."
                );
                if (userText?.toLowerCase() === "confirm") {
                  resetPlayerDataAndGame();
                  handleAction("import", () => toggleMenu("import"));
                }
              }}
            >
              <p className="menu-button-info text-reset-data-text">
                Default player data
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="overlay" style={getOverlayStyle("export")}>
        <div
          className="overlay-div data-div"
          style={getOverlayDivStyle("export")}
          ref={menuRefs.current.export}
        >
          <h1>Export</h1>
          <div className="data-action-container">
            <button onClick={() => handleExport(true)}>
              <p className="menu-button-info">To clipboard</p>
            </button>
            <button onClick={() => handleExport(false)}>
              <p className="menu-button-info">File</p>
            </button>
          </div>
        </div>
      </div>
      <button onClick={() => toggleMenu("info")}>
        <p className="menu-button-info text-[2.5em]">?</p>
      </button>
      <div className="overlay" style={getOverlayStyle("info")}>
        <div
          className="overlay-div"
          style={getOverlayDivStyle("info")}
          ref={menuRefs.current.info}
        >
          <div className="w-full h-9/10 overflow-y-auto flex-col justify-start px-[2em]">
            <MenuInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
