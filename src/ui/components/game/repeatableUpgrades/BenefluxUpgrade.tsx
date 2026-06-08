import { formatEffectSingular } from "@core/format/effect";
import RepeatableUpgrade from "@ui/components/features/RepeatableUpgrade";

function BenefluxUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="beneflux"
      className="group bg-beneflux-upgrade-bg hover:border-beneflux"
      textClassName="text-beneflux group-hover:text-beneflux-upgrade-hover"
      effectClassName="text-beneflux-upgrade-effect"
      effectChildren={(effect, affects) =>
        formatEffectSingular(effect, affects)
      }
    />
  );
}

export default BenefluxUpgrade;
