import RepeatableUpgrade from "@ui/components/base/RepeatableUpgrade";
import { formatEffectSingular } from "@core/format/effect";
import { hasNexusLevel } from "@game/features/nexus/utils/has";
import NexusSign from "../base/NexusSign";
import { hasNexusLevelSelection } from "@game/features/nexus/utils/selector";

function CoreUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="core"
      className="bg-core-bg"
      usePlayerSelector={(state) => hasNexusLevelSelection(state, 14, "14")}
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
