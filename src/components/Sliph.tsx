import { usePlayer } from "../player/playerStore";
import { toggleSliph } from "../playerActions";

function Sliph() {
  const { enteredSliph } = usePlayer((state) => ({
    enteredSliph: state.player.enteredSliph
  }));
  return (
    <button
      className="bg-linear-to-r from-sliph-bg-1 to-sliph-bg-2 border-image-gradient [border-image-source:var(--sliph-gradient-bg)] hover:[border-image-source:var(--sliph-gradient)]"
      onClick={toggleSliph}
    >
      <p>
        <span className="sliph">Sliph - </span>
        <span className="sliph-description">
          {enteredSliph ? "exit" : "enter"} the more challenging dimension
        </span>
      </p>
    </button>
  );
}

export default Sliph;
