// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<T> = (T extends any ? (x: T) => 0 : never) extends (
    x: infer R,
) => 0
    ? R
    : never;

export default UnionToIntersection;
