// 我尝试复刻 C# 里面的 CancellationToken 和 CancellationTokenSource, 发现 C# 之所以分离这两个，有一部分是设计原则的问题，
// 还有一个就是 CancellationToken 是一个 struct , 它永远不会变成null, 但这在 ts/js 中是无法实现的，所以混合这两者的功能，以便更方面的调用，
// 但是从原则来讲，使用token 的一方， 不应该调用任何跟 Cancel相关的主动方法, 请看 ICancelToken 和 ICancelSource

import { CancelError } from '@/errors';

/**
 * a CancelToken that support safe cancellation
 */
export class CancelToken implements ICancelSource, ICancelToken {
    constructor(afterms?: number) {
        if (typeof afterms === "number") {
            this.cancelAfter(afterms);
        }
    }

    isCanceled: boolean = false;


    throwIfCanceled() {
        if (this.isCanceled) {
            throw new CancelError()
        }
    }

    private _t?: number;

    cancelAfter(timems: number) {
        clearTimeout(this._t);
        this._t = setTimeout(() => {
            this.cancel();
        }, timems);
        return this;
    }

    stopCancel() {
        clearTimeout(this._t);
        return this;
    }

    /** link a @see ICancelSource   and return this  */
    linkCancel(cancelToken: CancelToken) {
        cancelToken.register(s => {
            this.cancel();
        })
        return this;
    }


    cancel() {
        if(this.isCanceled == false){
            this.isCanceled = true;
            this.triggerAction();
        }
    }

    private _actions: Array<(sender: CancelToken) => any> = [];

    private triggerAction() {
        while (this._actions.length > 0) {
            let act = this._actions.shift();
            act?.(this);
        }
    }

    register(action: (sender: CancelToken) => any) {
        this._actions.push(action);
        if (this.isCanceled) {
            // already canceled , so only trigger cancel
            this.triggerAction(); // after trigger the action will be remove
        }
        return this;
    }
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
    register(action: (sender: ICancelToken | ICancelSource) => any): ICancelToken
}