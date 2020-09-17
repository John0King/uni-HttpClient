import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';
export class TimeoutIntercepter {
    /**
     * 支持超时的拦截器
     * @param cancelAfterSeconds 全局超时秒数
     */
    constructor(cancelAfterSeconds) {
        this.cancelAfterSeconds = cancelAfterSeconds;
    }
    handle(request, next) {
        var _a, _b, _c, _d;
        if ((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) {
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise((resolve, reject) => {
                    reject(new CancelError());
                });
            }
        }
        if (((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.preventTimeout) != true) {
            if (this.cancelAfterSeconds != null && this.cancelAfterSeconds > 0) {
                if (request.pipeOptions == null) {
                    request.pipeOptions = {};
                }
                request.pipeOptions.timeout = this.cancelAfterSeconds;
            }
            if (((_c = request.pipeOptions) === null || _c === void 0 ? void 0 : _c.timeout) != null) {
                let t = request.pipeOptions.timeout;
                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = (_d = request.pipeOptions) === null || _d === void 0 ? void 0 : _d.cancelToken;
                if (ocancel) {
                    ocancel.linkCancel(cancel);
                }
                else {
                    request.pipeOptions.cancelToken = cancel;
                }
                return next(request).then(x => {
                    cancel.stopCancel();
                    return x;
                });
            }
        }
        return next(request);
    }
}
//# sourceMappingURL=timeout-interceper.js.map