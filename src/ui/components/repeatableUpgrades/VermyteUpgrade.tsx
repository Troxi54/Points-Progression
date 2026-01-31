import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";

function VermyteUpgrade() {
  return (
    <RepeatableUpgrade
      repeatableUpgradeId="vermyte"
      className="group bg-vermyte-upgrade-bg hover:border-vermyte"
      textClassName="text-vermyte group-hover:text-vermyte-hover"
      effectClassName="text-vermyte-upgrade-effect"
    />
  );
}

export default VermyteUpgrade;
