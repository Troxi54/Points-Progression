import RepeatableUpgrade from "@ui/components/features/RepeatableUpgrade";

function NullithUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="nullith"
      className="group bg-nullith-upgrade-bg hover:border-nullith-upgrade"
      textClassName="text-nullith-upgrade group-hover:text-nullith-upgrade-hover"
      effectClassName="text-nullith-upgrade-effect"
    />
  );
}

export default NullithUpgrade;
