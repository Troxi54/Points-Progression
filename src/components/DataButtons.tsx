import { useContext } from "react";
import { getConvertedPlayerData, loadPlayer, playerContext } from "./PlayerContext";

function DataButtons() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;

  function Import() {
    const userText = prompt('Enter your save data here. The current data will be lost.')
    if (userText) {
      const loadedPlayer = loadPlayer(userText);
      setPlayer(() => loadedPlayer);
    }
  }

  function Export() {
    const encodedData = getConvertedPlayerData(player);
    const time = new Date();
    const fileName = `Points Progression ${`${time.toLocaleTimeString().replace(/[:]/g, '-')} ${time.toLocaleDateString().replace(/[/]/g, '-')}`}.txt`;
    const blob = new Blob([encodedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div id="data-buttons">
      <button id="import-button" onClick={Import}>
        <p className="data-button-info">Import</p>
      </button>
      <button id="export-button" onClick={Export}>
        <p className="data-button-info">Export</p>
      </button>
    </div>
  );
}

export default DataButtons;