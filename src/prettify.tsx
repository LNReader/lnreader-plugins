export type Prettify<T> = T extends object
  ? {
      [K in keyof T]: T[K];
    } & {
      /** */
    }
  : T;
