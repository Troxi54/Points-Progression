interface Props {
  active: boolean;
}

function StatusText({ active }: Props) {
  return (
    <span
      className={`font-semibold transition-colors ${
        active ? "text-enabled" : "text-disabled"
      }`}
    >
      {active ? "ON" : "OFF"}
    </span>
  );
}

export default StatusText;
