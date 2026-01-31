import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";
import { formatEffectSingular } from "@/core/format/effect";

function CoreUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="core"
      className="bg-core-bg"
      effectClassName="text-core-upgrade-effect"
      effectChildren={(effect, affects) =>
        formatEffectSingular(effect, affects, "pow")
      }
    />
  );
}

export default CoreUpgrade;
