import { breakAmplivault } from "@/game/features/amplivault/utils";
import { usePlayerFields } from "@/ui/hooks/usePlayer";

function BreakAmplivault() {
  const { amplivaultBroken, reachedBreakAmplivault } = usePlayerFields({
    player: ["amplivaultBroken", "reachedBreakAmplivault"]
  });

  if (amplivaultBroken) return null;

  const BUTTON_STYLE =
    "flex items-center flex-col bg-linear-to-t from-break-amplivault-bg-1 to-break-amplivault-bg-2 border-image-gradient [border-image-source:linear-gradient(to_top,var(--color-break-amplivault-bg-1),var(--color-break-amplivault-bg-2))] hover:[border-image-source:linear-gradient(to_top,var(--color-break-amplivault-1),var(--color-break-amplivault-2))]";
  const DIV_STYLE =
    "w-full bg-linear-to-t from-break-amplivault-bg-1 to-break-amplivault-bg-2";

  const noInfo = !reachedBreakAmplivault || amplivaultBroken;

  return !reachedBreakAmplivault ? (
    <div className={DIV_STYLE}>
      <h2 className="break-amplivault text-[1.5em] font-bold mb-[1em] mt-[1em]">
        Requires a Nullith reset in Amplivault
      </h2>
    </div>
  ) : (
    <button className={BUTTON_STYLE} onClick={breakAmplivault}>
      <h2 className="break-amplivault text-[2em] font-bold mb-[0.5em] mt-[0.5em]">
        Break Amplivault
      </h2>
      {!noInfo && (
        <p className="text-gradient bg-linear-to-r from-break-amplivault-info-1 to-break-amplivault-info-2 text-balance">
          Breaking Amplivault allows the level of Amplivault to increase when
          you're not inside it. You can no longer enter Amplivault, and its
          effect becomes softcapped. This action is permanent.
        </p>
      )}
    </button>
  );
}

export default BreakAmplivault;
