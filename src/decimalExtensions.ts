import Decimal, { DecimalSource } from 'break_eternity.js';

Decimal.prototype.softcap = function(start: DecimalSource, value: DecimalSource, mode: 'pow' | 'mul'): Decimal {
    if (this.lte(start)) return this;
    start = new Decimal(start);
    value = new Decimal(value);

    if (mode === 'mul') {
      return start.add(this.sub(start).multiply(value));
    }
    return start.multiply(this.dividedBy(start).pow(value));
};