import { DecimalSource } from 'break_eternity.js';

declare module "break_eternity.js" {
  export default interface Decimal {
    softcap(start: DecimalSource, value: DecimalSource, mode: 'pow' | 'mul'): Decimal;
  }
}