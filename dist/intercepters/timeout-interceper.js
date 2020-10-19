import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';
export class TimeoutIntercepter {
    /**
     * 支持超时的拦截器
     * @param cancelAfterSeconds 全局超时秒数
     */
    constructor(cancelAfterSeconds) {
        this.cancelAfterSeconds = cancelAfterSeconds;
        this._key = "__timeoutintercepter_attached";
    }
    handle(request, next) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) && ((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b[this._key]) != true) {
            // 如果已经取消，那就直接返回错误
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise((resolve, reject) => {
                    reject(new CancelError());
                });
            }
        }
        if (((_c = request.pipeOptions) === null || _c === void 0 ? void 0 : _c.preventTimeout) != true) {
            if (this.cancelAfterSeconds != null && this.cancelAfterSeconds > 0) {
                if (request.pipeOptions == null) {
                    request.pipeOptions = {};
                    request.pipeOptions.timeout = this.cancelAfterSeconds;
                }
            }
            if (((_d = request.pipeOptions) === null || _d === void 0 ? void 0 : _d.timeout) != null) {
                let t = request.pipeOptions.timeout;
                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = ((_e = request.pipeOptions) === null || _e === void 0 ? void 0 : _e[this._key]) == true ? (_f = request.pipeOptions) === null || _f === void 0 ? void 0 : _f.__timeoutintercepter_ocancel : (_g = request.pipeOptions) === null || _g === void 0 ? void 0 : _g.cancelToken;
                if (ocancel != null) {
                    cancel.linkToken(ocancel);
                    request.pipeOptions.__timeoutintercepter_ocancel = ocancel;
                }
                request.pipeOptions.cancelToken = cancel;
                // 通过注入这个属性，来通知自己下次的 token 是自己的
                request.pipeOptions[this._key] = true;
                return next(request).then(x => {
                    cancel.stopCancel();
                    if (request.pipeOptions != null) {
                        // 如果允许正常则删除这个， 如果不正常就不删除了，下次 retry的时候就可以重置时间了
                        request.pipeOptions[this._key] = false;
                        delete request.pipeOptions[this._key];
                    }
                    return x;
                });
            }
        }
        return next(request);
    }
}
//# sourceMappingURL=timeout-interceper.js.map