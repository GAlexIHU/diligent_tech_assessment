export type Lazy<T> = {
  [K in keyof T as PropGetter<T, K>]: () => T[K];
};

type PropGetter<T, K extends keyof T> = `get${Capitalize<string & K>}`;
