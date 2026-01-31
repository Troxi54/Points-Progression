import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";

function AmplivoidUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="amplivoid"
      className="group bg-amplivoid-upgrade-bg hover:border-amplivoid"
      textClassName="text-amplivoid group-hover:text-amplivoid-upgrade-hover"
      effectClassName="text-amplivoid-upgrade-effect"
    />
  );
}

export default AmplivoidUpgrade;
