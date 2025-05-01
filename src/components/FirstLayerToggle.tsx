/* import { useContext } from "react";
import { playerContext } from "../playerUtils";

function FirstLayerToggle() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }
  
  const { player, setPlayer } = context;
  
  function toggle() {
    setPlayer(prev => ({
      ...prev,
      firstLayerHidden: !prev.firstLayerHidden
    }));
  }

  function contextMenu(e: React.MouseEvent) {
    e.preventDefault();
    toggle();
  }

  return (
    <div className="absolute w-auto top-[-3em] z-5">
      <button onClick={toggle} onContextMenu={contextMenu}>{player.firstLayerHidden ? 'Show layer' : 'Hide layer'}</button>
    </div>
    
  );
}

export default FirstLayerToggle; */