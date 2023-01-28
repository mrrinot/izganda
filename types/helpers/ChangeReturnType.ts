/* eslint-disable @typescript-eslint/no-explicit-any */

type ChangeReturnType<F extends (...args: any) => any, NewReturnT> = F extends (
    ...args: infer Args
) => any
    ? (...args: Args) => NewReturnT
    : never;

export default ChangeReturnType;

type PromisifyReturnType<F extends (...args: any) => any> = ChangeReturnType<
    F,
    ReturnType<F> extends Promise<any> ? ReturnType<F> : Promise<ReturnType<F>>
>;

export { PromisifyReturnType };
