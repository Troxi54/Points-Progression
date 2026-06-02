import { formatEffectSingular } from "@core/format/effect";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";
import NexusSign from "@ui/components/features/NexusSign";
import RepeatableUpgrade from "@ui/components/features/RepeatableUpgrade";

function CoreUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="core"
      className="bg-core-bg"
      playerSelector={(state) => hasNexusLevelSelection(state, 14, "14")}
      textChildren={({ player }) =>
        hasNexusLevel(player, 14) && (
          <>
            {" "}
            <NexusSign level={14} className="font-bold" />
          </>
        )
      }
      effectClassName="text-core-upgrade-effect"
      effectChildren={(effect, affects) =>
        formatEffectSingular(effect, affects, "pow")
      }
    />
  );
}

export default CoreUpgrade;
