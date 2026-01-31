import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";

function AmplifluxUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="ampliflux"
      className="group bg-ampliflux-upgrade-bg hover:border-ampliflux"
      textClassName="text-ampliflux group-hover:text-ampliflux-upgrade-hover"
      effectClassName="text-ampliflux-upgrade-effect"
    />
  );
}

export default AmplifluxUpgrade;
