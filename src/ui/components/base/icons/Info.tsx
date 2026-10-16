import Svg, { SvgProps } from "../Svg";

function InfoIcon({ ...props }: SvgProps) {
  return (
    <Svg {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="currentColor"
        d="M10.588 6.413Q10 5.825 10 5t.588-1.412T12 3t1.413.588T14 5t-.587 1.413T12 7t-1.412-.587m.35 14.15q-.438-.438-.438-1.063v-9q0-.625.438-1.062T12 9t1.063.438t.437 1.062v9q0 .625-.437 1.063T12 21t-1.062-.437"
      />
    </Svg>
  );
}

export default InfoIcon;
