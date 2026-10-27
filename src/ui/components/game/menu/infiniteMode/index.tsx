// import { toggleInfiniteMode } from "@game/features/infiniteMode/utils/toggle";
// import Button from "@ui/components/base/Button";
import { usePlayer } from "@ui/hooks/usePlayer/main";

function InfiniteModeButton() {
  const { infiniteModeUnlocked } = usePlayer((state) => ({
    infiniteModeUnlocked: state.mergedPlayer.cachedPlayer.infiniteMode.unlocked,
  }));

  if (!infiniteModeUnlocked) return null;

  return null;

  // return (
  //   <Button
  //     onClick={() => toggleInfiniteMode()}
  //     variant="menu-toggle"
  //     aria-label="Enter Infinite Mode"
  //   ></Button>
  // );
}

export default InfiniteModeButton;
