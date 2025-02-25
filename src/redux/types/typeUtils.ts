// Utility Types

/**
 *
 * DiscriminateUnion and MapDiscriminatedUnion utility types found on this forum post:
 *
 * https://stackoverflow.com/a/50125960
 *
 */

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = Extract<T, Record<K, V>>;

export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

// Utility Functions

export const typedObjectKeys = <TObject extends object>(obj: TObject) => {
  return Object.keys(obj) as Array<keyof TObject>;
};
