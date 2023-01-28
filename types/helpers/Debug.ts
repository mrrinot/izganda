// Helpers taken from https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type

type Debug<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// eslint-disable-next-line @typescript-eslint/ban-types
type DebugRecursively<T> = T extends object
    ? T extends infer O
        ? { [K in keyof O]: DebugRecursively<O[K]> }
        : never
    : T;

export { Debug, DebugRecursively };
