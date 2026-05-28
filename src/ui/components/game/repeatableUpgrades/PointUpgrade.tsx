import RepeatableUpgrade from "@ui/components/features/RepeatableUpgrade";

function PointUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="point"
      className="group bg-point-upgrade-bg hover:border-point-upgrade-accent"
      textClassName="text-point-upgrade-accent group-hover:text-point-upgrade-accent-hover"
      effectClassName="text-point-upgrade-effect"
    />
  );
}

export default PointUpgrade;
