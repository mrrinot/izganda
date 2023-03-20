// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const earlySuccess = (...calls: Array<() => any | null>) => {
    for (let i = 0; i < calls.length; i++) {
        const ret = calls[i]();

        if (ret) {
            return ret;
        }
    }

    return null;
};
