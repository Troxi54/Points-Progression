import { useContext, useEffect, useRef, useState } from "react";
import { getConvertedPlayerData, loadPlayer, playerContext, savePlayerToLocalStorage, settings } from "../playerUtils";
import { CSSProperties } from "react";
import { format } from "../format";
import { calculateOfflineTierResets } from "../offline";
import CloseIcon from "./CloseIcon";

function Menu() {
  const context = useContext(playerContext);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isOpenedMenu, setIsOpenedMenu] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isOpenedInfoMenu, setIsOpenedInfoMenu] = useState(false);
  const [shouldInfoRender, setShouldInfoRender] = useState(false);
  const [isOpenedImportMenu, setIsOpenedImportMenu] = useState(false);
  const [shouldImportRender, setShouldImportRender] = useState(false);
  const [isOpenedExportMenu, setIsOpenedExportMenu] = useState(false);
  const [shouldExportRender, setShouldExportRender] = useState(false);
  const [isOpenedMoreMenu, setIsOpenedMoreMenu] = useState(false);
  const [shouldMoreRender, setShouldMoreRender] = useState(false);

  const saveTimeout = useRef<number | null>(null);
  const SAVE_WAITING_TIME = 1000;

  const exportTimeout = useRef<number | null>(null);
  const EXPORT_WAITING_TIME = 1000;

  const importTimeout = useRef<number | null>(null);
  const IMPORT_WAITING_TIME = 1000;

  function Import() {
    const userText = prompt('Enter your save data here. The current data will be lost.');
    if (userText) {
      const loadedPlayer = loadPlayer(userText);
      setPlayer(() => loadedPlayer);
      calculateOfflineTierResets(setPlayer);
      setIsImporting(true);
      if (importTimeout.current) {
        clearTimeout(importTimeout.current);
      }
      importTimeout.current = setTimeout(() => {
        setIsImporting(false);
      }, IMPORT_WAITING_TIME);
      setIsOpenedImportMenu(false);
    }
  }

  function Export() {
    const encodedData = getConvertedPlayerData(playerRef.current);
    const time = new Date();
    const fileName = `Points Progression ${`${time.toLocaleTimeString().replace(/[:]/g, '-')} ${time.toLocaleDateString().replace(/[/]/g, '-')}`}.txt`;
    const blob = new Blob([encodedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
    setIsExporting(true);
    if (exportTimeout.current) {
      clearTimeout(exportTimeout.current);
    }
    exportTimeout.current = setTimeout(() => {
      setIsExporting(false);
    }, EXPORT_WAITING_TIME);
    setIsOpenedExportMenu(false);
  }

  async function ExportText() {
    try {
      const text = getConvertedPlayerData(playerRef.current);
      await navigator.clipboard.writeText(text);
      setIsExporting(true);
      if (exportTimeout.current) {
        clearTimeout(exportTimeout.current);
      }
      exportTimeout.current = setTimeout(() => {
        setIsExporting(false);
      }, EXPORT_WAITING_TIME);
      setIsOpenedExportMenu(false);
    } catch (err) {
      alert("Unsuccessful copy to clipboard, " + err);
    }
  }

  function Save() {
    savePlayerToLocalStorage(playerRef.current);
    setIsSaving(true);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      setIsSaving(false);
    }, SAVE_WAITING_TIME);
  }

  const saveTextStyle: CSSProperties = {
    opacity: isSaving ? 1 : 0,
    transition: 'opacity 250ms linear',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const saveDefaultTextStyle: CSSProperties = {
    opacity: isSaving ? 0 : 1,
    transition: 'opacity 250ms linear',
  };

  const exportTextStyle: CSSProperties = {
    opacity: isExporting ? 1 : 0,
    transition: 'opacity 250ms linear',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const exportDefaultTextStyle: CSSProperties = {
    opacity: isExporting ? 0 : 1,
    transition: 'opacity 250ms linear',
  };

  const importTextStyle: CSSProperties = {
    opacity: isImporting ? 1 : 0,
    transition: 'opacity 250ms linear',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const importDefaultTextStyle: CSSProperties = {
    opacity: isImporting ? 0 : 1,
    transition: 'opacity 250ms linear',
  };

  useEffect(() => {
    if (isOpenedMenu) {
      setShouldRender(true);
    } else {
      setTimeout(() => setShouldRender(false), 200);
    }
    if (isOpenedInfoMenu) {
      setShouldInfoRender(true);
    } else {
      setTimeout(() => setShouldInfoRender(false), 200);
    }
    if (isOpenedImportMenu) {
      setShouldImportRender(true);
    } else {
      setTimeout(() => setShouldImportRender(false), 200);
    }
    if (isOpenedExportMenu) {
      setShouldExportRender(true);
    } else {
      setTimeout(() => setShouldExportRender(false), 200);
    }
    if (isOpenedMoreMenu) {
      setShouldMoreRender(true);
    } else {
      setTimeout(() => setShouldMoreRender(false), 200);
    }
  }, [isOpenedMenu, isOpenedInfoMenu, isOpenedImportMenu, isOpenedExportMenu, isOpenedMoreMenu]);

  const menuStyle: CSSProperties = {
    visibility: shouldRender ? 'visible' : 'hidden',
    opacity: isOpenedMenu ? 1 : 0,
    transform: `scaleX(${isOpenedMenu ? '1': '0'})`,
    transformOrigin: 'right'
  };

  const infoDivStyle: CSSProperties = {
    visibility: shouldInfoRender ? 'visible' : 'hidden',
    opacity: isOpenedInfoMenu ? 1 : 0,
  };

  const importDivStyle: CSSProperties = {
    visibility: shouldImportRender ? 'visible' : 'hidden',
    opacity: isOpenedImportMenu ? 1 : 0,
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        const loadedPlayer = loadPlayer(fileContent);
        setPlayer(() => loadedPlayer);
        calculateOfflineTierResets(setPlayer);
        setIsImporting(true);
        if (importTimeout.current) {
          clearTimeout(importTimeout.current);
        }
        importTimeout.current = setTimeout(() => {
          setIsImporting(false);
        }, IMPORT_WAITING_TIME);
        setIsOpenedImportMenu(false);
      };
      reader.readAsText(file);
    } else {
      alert("Wrong file type");
    }
  }

  const exportDivStyle: CSSProperties = {
    visibility: shouldExportRender ? 'visible' : 'hidden',
    opacity: isOpenedExportMenu ? 1 : 0,
  };

  const moreMenuDivStyle: CSSProperties = {
    visibility: shouldMoreRender ? 'visible' : 'hidden',
    opacity: isOpenedMoreMenu ? 1 : 0,
  };

  if (!context) {
    return (
      <div>Loading...</div>
    );
  }

  const { player, setPlayer, playerRef } = context;

  return (
    <div id="main-buttons" className="w-full justify-start pr-4 flex-row-reverse gap-4">
      <button id="menu-toggle" className="flex flex-col gap-[.6rem] items-center justify-center py-2" onClick={() => setIsOpenedMenu(!isOpenedMenu)}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <div id="data-buttons" className="absolute h-12 right-24 gap-[5%] bg-button-bg px-8 transition-[opacity_transform] transition-ease duration-200" style={menuStyle}>
        <button id="open-more-menu" onClick={() => setIsOpenedMoreMenu(true)}>
          <p className="menu-button-info">More</p>
        </button>
        <button id="save-button" onClick={Save}>
          <p className="menu-button-info" style={saveTextStyle}>Saved!</p>
          <p className="menu-button-info" style={saveDefaultTextStyle}>Save</p>
        </button>
        <button id="import-button" onClick={() => setIsOpenedImportMenu(true)}>
          <p className="menu-button-info" style={importTextStyle}>Imported!</p>
          <p className="menu-button-info" style={importDefaultTextStyle}>Import</p>
        </button>
        <button id="export-button" onClick={() => setIsOpenedExportMenu(true)}>
          <p className="menu-button-info" style={exportTextStyle}>Exported!</p>
          <p className="menu-button-info" style={exportDefaultTextStyle}>Export</p>
        </button>
      </div>
      <div id="more-overlay" className="overlay text-[1.6vmin]" style={moreMenuDivStyle}>
        <div id="more-div" className="overlay-div">
          <button className="overlay-close-button" onClick={() => setIsOpenedMoreMenu(false)}>
            <CloseIcon/>
          </button>
          <div className="gap-[2em] flex-col w-9/10 h-9/10 overflow-y-auto">
            <div className="more-menu-row">
              <button id="exponential-notation-button" className="more-menu-button" onClick={() => {
                setPlayer(prev => ({
                  ...prev,
                  exponentialNotation: !prev.exponentialNotation
                }));
              }}>
                <p className="menu-button-info">Exponential notation: {player.exponentialNotation ? 'ON' : 'OFF'}</p>
              </button>
              <button id="stable-progress-bar-button" className="more-menu-button" onClick={() => {
                setPlayer(prev => ({
                  ...prev,
                  stableProgressBars: !prev.stableProgressBars
                }));
              }}>
                <p className="menu-button-info">Stable progress bars: {player.stableProgressBars ? 'ON' : 'OFF'}</p>
                <div className="tooltip-trigger">?</div>
                <div className="tooltip">Prevents rapid updates of progress bars when resets per second exceed 5 by locking them at 100%. Helps reduce potential screen wear</div>
              </button>
              <a id="discord-button" className="more-menu-button px-[1.2em] py-[0.5em] flex flex-col justify-center items-center gap-[0.25em] box-border" href="https://discord.gg/YT8R2szHXX" type="button" target="_blank">
                <p className="menu-button-info">Discord</p>
                <img src="./discord.png" className="h-[1em] w-[initial]" alt="Discord"></img>
              </a>
            </div>
            <p>Points Progression by Troxi<br/>Version: {player.gameVersion}</p>
          </div>
        </div>
      </div>
      <div id="import-overlay" className="overlay" style={importDivStyle}>
        <div className="overlay-div data-div">
          <button className="overlay-close-button" onClick={() => setIsOpenedImportMenu(false)}>
            <CloseIcon/>
          </button>
          <h1>Import</h1>
          <div className="data-action-container gap-4">
            <button id="import-from-text" onClick={Import}>
              <p className="menu-button-info">From text</p>
            </button>
            <button id="import-from-file-container" onClick={() => document.getElementById('import-from-file')?.click()}>
              <p className="menu-button-info">From file</p>
              <input id="import-from-file" type="file" hidden onChange={handleFileChange} accept="text/plain"/>
            </button>
          </div>
        </div>
      </div>
      <div id="export-overlay" className="overlay" style={exportDivStyle}>
        <div className="overlay-div data-div">
          <button className="overlay-close-button" onClick={() => setIsOpenedExportMenu(false)}>
            <CloseIcon/>
          </button>
          <h1>Export</h1>
          <div className="data-action-container gap-4">
            <button id="export-to-clipboard" onClick={ExportText}>
              <p className="menu-button-info">To clipboard</p>
            </button>
            <button id="export-file" onClick={Export}>
              <p className="menu-button-info">File</p>
            </button>
          </div>
        </div>
      </div>
      <button className="text-5xl" onClick={() => setIsOpenedInfoMenu(true)}>
        <p className="menu-button-info">?</p>
      </button>
      <div id="info-overlay" className="overlay" style={infoDivStyle}>
        <div id="info-div" className="overlay-div">
          <button className="overlay-close-button" onClick={() => setIsOpenedInfoMenu(false)}>
            <CloseIcon/>
          </button>
          <div className="w-full h-9/10 overflow-y-auto flex-col justify-start px-24">
            <h1>About this game</h1>
            <p>The game has a lot of timewalls, and even begins with one - so be prepared for that. At first, the game may feel slow and uninteresting, but once you reach 1M points, the experience becomes much more engaging. Additionally, all upgrades without level limits can be purchased multiple levels at once, but you only pay for the last level. For example, if the cost for levels 1, 2, and 3 is 10, 20, and 30 points respectively, you only pay 30 points for upgrading to level 3 directly. With this knowledge, you can drastically speed up your progress.</p>
            <p className="info-important mb-12">Frequently exporting your save file is highly recommended because the game is still in beta, and potential bugs may reset your progress</p>
            <h2>Number notation</h2>
            <p className="mb-0">The game also has a unique number notation system, here it is:</p>
            <p className="mb-12">1k = 1000<br/>1M = 10<sup>6</sup><br/>1B = 10<sup>9</sup><br/>1T = 10<sup>12</sup><br/>1U = 10<sup>18</sup><br/>1U+ = 10<sup>24</sup><br/>1U++ = 10<sup>30</sup><br/>1A = 10<sup>36</sup><br/>1A+ = 10<sup>42</sup><br/>1A++ = 10<sup>48</sup><br/>1C = 10<sup>54</sup><br/>1C+ = 10<sup>60</sup><br/>1C++ = 10<sup>66</sup><br/>1S = 10<sup>72</sup><br/>1S+ = 10<sup>78</sup><br/>1S++ = 10<sup>84</sup><br/>1O = 10<sup>90</sup><br/>1O+ = 10<sup>96</sup><br/>1O++ = 10<sup>102</sup><br/>1N = 10<sup>108</sup><br/>1N+ = 10<sup>114</sup><br/>1N++ = 10<sup>120</sup><br/>1D = 10<sup>126</sup><br/>1D+ = 10<sup>132</sup><br/>1D++ = 10<sup>138</sup><br/>1L = 10<sup>144</sup><br/>1L+ = 10<sup>150</sup><br/>1L++ = 10<sup>156</sup><br/>1OP = 10<sup>162</sup><br/>1OP+ = 10<sup>168</sup><br/>1OP++ = 10<sup>174</sup><br/>1OP* = 10<sup>180</sup><br/>1OP** = 10<sup>186</sup><br/>1OP^ = 10<sup>192</sup><br/>1OP^^ = 10<sup>198</sup><br/>1i = 10<sup>204</sup><br/>Exponential at 10<sup>213</sup></p>
            <h2>Formulas</h2>
            <p>Upgrade cost:<span className="info-effect"> {format(settings.upgradeStartingCost)} × {format(settings.upgradeScaling)}<sup>x</sup>, where x is the upgrade level</span>
              <br/>Upgrade effect:<span className="info-effect"> {format(settings.upgradeEffectScaling)}<sup>x</sup>, where x is the upgrade level</span>
              {player.everMadeRun && <><br/>
              Best run effect:<br/><span className="info-effect">
                      if best run is less than or equal to 2 hours: min(1 + log(y) / log(x), 2) × 5<sup>log(y) - log(x)</sup>
                      <br/>Otherwise: min(1 + log(y) / log(x), 2)
                      <br/>Where: x is best run (in milliseconds) and y is 2 hours (in milliseconds)</span></>}
              {player.everMadeRun && <><br/>Best points effect:<span className="info-effect"> (1 + log(max(x, 1,000,000) / 1,000,000))<sup>1.3</sup>, where x is best points</span></>}
              {player.everMadeTier && <><br/>Tier requirement:<span className="info-effect"> {format(settings.firstTierAt)} × 1,000<sup>x</sup>, where x is tier</span>
              <br/>Tier effect:<span className="info-effect"> 3<sup>x</sup>, where x is tier</span>
              <br/>Tier resets made effect:<br/><span className="info-effect">
                      if tier resets made are less than 1,000,000: (x + 1)<sup>1.2</sup>
                      <br/>Otherwise: (1,000,000 × ((x + 1) / 1,000,000)<sup>0.25</sup>)<sup>1.2</sup>
                      <br/>Where x is tier resets made</span></>}
              {(player.boughtFourthTierUpgrade || player.everMadeVermyros) && <>
              <br/>Ampliflux effect:<span className="info-effect"> 2<sup>log(x + 1)</sup>, where x is ampliflux</span>
              <br/>Ampliflux upgrade cost:<span className="info-effect"> {format(settings.amplifluxUpgradeStartingCost)} × {format(settings.amplifluxUpgradeCostScaling)}<sup>x</sup>, where x is the ampliflux upgrade level</span>
              <br/>Ampliflux upgrade effect:<span className="info-effect"> {format(settings.amplifluxUpgradeEffectScaling)}<sup>x</sup>, where x is the ampliflux upgrade level</span></>}
              {player.everMadeVermyros && <><br/>Vermytes: <span className="info-effect">
                  <br/>if points are greater than {format(settings.vermyrosGoal)}: 2<sup>max(log<sub>1,000,000</sub>(x / {format(settings.vermyrosGoal)}), 0)</sup>
                  <br/>Otherwise: 0
                  <br/>Where x is points</span>
              <br/>Best vermytes effect:<span className="info-effect"> x<sup>3</sup>, where x is best vermytes</span>
              <br/>Vermora effect:<span className="info-effect"> 2<sup>log(x + 1)</sup>, where x is vermora</span></>}
              {player.boughtFirstVermyrosUpgrade && <><br/>Vermyte upgrade cost:<span className="info-effect"> {format(settings.vermytesUpgradeCostScaling)}<sup>x</sup>, where x is the vermyte upgrade level</span>
              <br/>Vermyte upgrade effect:<span className="info-effect"> {format(settings.vermytesUpgradeEffectScaling)}<sup>x</sup>, where x is the vermyte upgrade level</span></>}
              {player.boughtFifthVermyrosUpgrade && <><br/>Amplivault level requirement:<span className="info-effect"> {format(settings.amplivaultRequirementStartsAt)} × 1,000<sup>x</sup>, where x is amplivault level</span></>}
              {player.amplivaultLevel.greaterThan(0) && <><br/>Amplivault effect:<span className="info-effect"> 2<sup>x</sup>, where x is amplivault level</span></>}
              {player.boughtEighthVermyrosUpgrade && <><br/>Energy effect:<span className="info-effect"> 1.75<sup>log(x + 1)</sup>, where x is energy</span></>}
              {player.everReachedCores && <><br/>Cores:<span className="info-effect"> x / 1,000,000</span>, where x is energy</>}
              {player.everMadeCoreReset && <><br/>Core effect:<span className="info-effect"> 4<sup>log(x + 1)</sup></span>
                <br/>Core upgrade cost:<span className="info-effect"> {format(settings.coreUpgradeStartingCost)} × {format(settings.coreUpgradeCostScaling)}<sup>x</sup>, where x is the core upgrade level</span>
                <br/>Core upgrade effect:<span className="info-effect"> {format(settings.coreUpgradeEffectScaling)}<sup>x</sup>, where x is the core upgrade level</span></>}
            </p>
            <p>Current endgame: <span className="spoiler">{format(settings.endgameAt)}</span> <span className="info-effect">(hover to see)</span></p>
            <p>If you find a bug, please report it to Troxi, the developer of the game.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;