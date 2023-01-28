type KeysWhereTypeCanBe<
    Terface,
    Filter,
    K extends keyof Terface = keyof Terface,
> = K extends (Filter extends Terface[K] ? K : never) ? K : never;

export default KeysWhereTypeCanBe;
