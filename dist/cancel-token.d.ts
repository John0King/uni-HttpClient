/**
 * a CancelToken that support safe cancellation
 */
export declare class CancelToken implements ICancelSource, ICancelToken {
    constructor(afterms?: number);
    isCanceled: boolean;
    throwIfCanceled(): void;
    private _t?;
    cancelAfter(timems: number): this;
    stopCancel(): this;
    /** link a @see ICancelSource   and return this  */
    linkCancel(cancelToken: CancelToken): this;
    cancel(): void;
    private _actions;
    private triggerAction;
    register(action: (sender: CancelToken) => any): this;
}
export interface ICancelSource {
    cancelAfter(timems: number): ICancelSource;
    cancel(): void;
    stopCancel(): ICancelSource;
}
export interface ICancelToken {
    isCanceled: boolean;
    throwIfCanceled(): void;
    linkCancel(cancelToken: ICancelSource): ICancelToken;
    register(action: (sender: ICancelToken | ICancelSource) => any): ICancelToken;
}
