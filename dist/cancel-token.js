// 我尝试复刻 C# 里面的 CancellationToken 和 CancellationTokenSource, 发现 C# 之所以分离这两个，有一部分是设计原则的问题，
// 还有一个就是 CancellationToken 是一个 struct , 它永远不会变成null, 但这在 ts/js 中是无法实现的，所以混合这两者的功能，以便更方面的调用，
// 但是从原则来讲，使用token 的一方， 不应该调用任何跟 Cancel相关的主动方法, 请看 ICancelToken 和 ICancelSource
import { CancelError } from './errors';
/**
 * a CancelToken that support safe cancellation
 */
export class CancelToken {
    constructor(option) {
        this.isCanceled = false;
        this._actions = [];
        if (typeof option === "number") {
            this.cancelAfter(option);
        }
        else if (option == null) {
            return;
        }
        else {
            try {
                option.register(x => this.cancel());
            }
            catch (e) {
                throw new Error(`argument must be a instace of interface ICancelToken or class CancelToken : ${e}`);
            }
        }
    }
    throwIfCanceled() {
        if (this.isCanceled) {
            throw new CancelError();
        }
    }
    linkToken(token) {
        token.register(x => this.cancel());
    }
    cancelAfter(timems) {
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
    cancel() {
        if (this.isCanceled == false) {
            this.isCanceled = true;
            this.triggerAction();
        }
    }
    triggerAction() {
        while (this._actions.length > 0) {
            let act = this._actions.shift();
            act === null || act === void 0 ? void 0 : act(this);
        }
    }
    register(action) {
        this._actions.push(action);
        if (this.isCanceled) {
            // already canceled , so only trigger cancel
            this.triggerAction(); // after trigger the action will be remove
        }
        return this;
    }
    getToken() {
        return this;
    }
}
//# sourceMappingURL=cancel-token.js.map