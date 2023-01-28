type KeysOfType<
    Terface,
    Filter,
    K extends keyof Terface = keyof Terface,
> = K extends (Terface[K] extends Filter ? K : never) ? K : never;

export default KeysOfType;
