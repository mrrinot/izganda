type MakeNonOptional<
    T,
    K extends keyof T = keyof T,
    RemainingKeys extends keyof T = Exclude<keyof T, K>,
> = Required<{ [P in K]: T[P] }> & { [P in RemainingKeys]: T[P] };

export default MakeNonOptional;
