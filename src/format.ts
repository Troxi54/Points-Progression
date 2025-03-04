export function format(num: number, precision: number | "auto" = "auto"): string {
  function removePrecisionIf() {
    if (divided >= 1000 && precisionWasAuto)
      precision = 0;
  }
  if (num === 0) return '0';
  if (num < 1 && num > -1) {
    if (precision === "auto")
      precision = 2;
    return num.toFixed(precision);
  }
  if ((num >= 1000 || num <= -1000) && precision === 0) {
    precision = 'auto';
  }
  let precisionWasAuto = false;
  if (precision === "auto") {
    precisionWasAuto = true;
    precision = num / 1000 ** Math.floor(Math.log10(Math.abs(num)) / 3);
    precision = 3 - Math.floor(Math.log10(precision));
  }
  const units = ['', 'k', 'M', 'B', 'T']; 
  let index = Math.floor(Math.log10(Math.abs(num)) / 3);
  index = Math.min(units.length - 1, index);
  let divided = (num / 1000 ** index);
  if (divided >= 1e6) {
    const units2 = ['', 'U', 'U+', 'U++', 'U+++', 'OP', 'OP+',
                    'OP*', 'OP^', 'OP^^', 'OP^^^', 'i'];
    index = Math.floor(Math.log10(Math.abs(divided)) / 6);
    index = Math.min(units2.length - 1, index);
    divided = (divided / 1e6 ** index);
    if (divided >= 1e9) {
      if (precisionWasAuto)
        precision = 2;
      return num.toExponential(precision).replace(/[+]/, '');
    }
    removePrecisionIf();
    return divided.toFixed(precision) + units2[index];
  }
  removePrecisionIf();
  return divided.toFixed(precision) + units[index];
}

export function formatTime(ms: number): string {
  if (ms < 1000) {
    return ms + 'ms';
  }
  if (ms < 60000) {
    return (ms / 1000).toFixed(3) + "s";
  }

  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return ms >= 600000 ? `${hh}${mm}:${ss}` : `${hh}${mm}:${ss}.${(ms % 1000).toString().padStart(3, "0")}`;
}