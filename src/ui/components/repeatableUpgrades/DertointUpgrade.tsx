import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";

function DertointUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="dertoint"
      className="group bg-dertoint-upgrade-bg hover:border-dertoint-upgrade-accent"
      textClassName="text-dertoint-upgrade-accent group-hover:text-dertoint-upgrade-accent-hover"
      effectClassName="text-dertoint-upgrade-effect"
    />
  );
}

export default DertointUpgrade;
