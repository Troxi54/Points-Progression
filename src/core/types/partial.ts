export type PartialBut<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
