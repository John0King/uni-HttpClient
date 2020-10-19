/**
 * a CancelToken that support safe cancellation
 */
export declare class CancelToken implements ICancelSource, ICancelToken {
    constructor();
    constructor(token: CancelToken);
    constructor(token: ICancelToken);
    constructor(afterms: number);
    isCanceled: boolean;
    throwIfCanceled(): void;
    linkToken(token: CancelToken): void;
    linkToken(token: ICancelToken): void;
    private _t?;
    cancelAfter(timems: number): this;
    stopCancel(): this;
    cancel(): void;
    private _actions;
    private triggerAction;
    register(action: (sender: CancelToken) => any): this;
    getToken(): CancelToken;
}
export interface ICancelSource {
    cancelAfter(timems: number): ICancelSource;
    cancel(): void;
    stopCancel(): ICancelSource;
    linkToken(token: ICancelToken): void;
    getToken(): ICancelToken;
}
export interface ICancelToken {
    isCanceled: boolean;
    throwIfCanceled(): void;
    register(action: (sender: ICancelToken) => any): ICancelToken;
}
