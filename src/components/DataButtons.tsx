import { useContext, useRef, useState } from "react";
import { getConvertedPlayerData, loadPlayer, playerContext, savePlayerToLocalStorage } from "../playerUtils";
import { CSSProperties } from "react";

function DataButtons() {
  const context = useContext(playerContext);

  
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const saveTimeout = useRef<number | null>(null);
  const SAVE_WAITING_TIME = 1000;

  const exportTimeout = useRef<number | null>(null);
  const EXPORT_WAITING_TIME = 1000;

  const importTimeout = useRef<number | null>(null);
  const IMPORT_WAITING_TIME = 1000;

  if (!context) {
    return (
      <div>Loading...</div>
    );
  }

  const { setPlayer, playerRef } = context;

  function Import() {
    const userText = prompt('Enter your save data here. The current data will be lost.');
    if (userText) {
      const loadedPlayer = loadPlayer(userText);
      setPlayer(() => loadedPlayer);
      setIsImporting(true);
      if (importTimeout.current) {
        clearTimeout(importTimeout.current);
      }
      importTimeout.current = setTimeout(() => {
        setIsImporting(false);
      }, IMPORT_WAITING_TIME);
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


  return (
    <div id="data-buttons">
      <button id="save-button" onClick={Save}>
        <p className="data-button-info" style={saveTextStyle}>Saved!</p>
        <p className="data-button-info" style={saveDefaultTextStyle}>Save</p>
      </button>
      <button id="import-button" onClick={Import}>
      <p className="data-button-info" style={importTextStyle}>Imported!</p>
      <p className="data-button-info" style={importDefaultTextStyle}>Import</p>
      </button>
      <button id="export-button" onClick={Export}>
        <p className="data-button-info" style={exportTextStyle}>Exported!</p>
        <p className="data-button-info" style={exportDefaultTextStyle}>Export</p>
      </button>
    </div>
  );
}

export default DataButtons;
