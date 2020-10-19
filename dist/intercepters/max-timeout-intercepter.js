import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';
import { Task } from '../task/task';
export class MaxTimeoutIntercepter {
    constructor(maxTimeoutSeconds = 30) {
        this.maxTimeoutSeconds = maxTimeoutSeconds;
    }
    handle(request, next) {
        var _a, _b, _c, _d, _e;
        if ((_b = (_a = request === null || request === void 0 ? void 0 : request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
            return Task.fromError(new CancelError());
        }
        if (((_c = request.pipeOptions) === null || _c === void 0 ? void 0 : _c.preventTimeout) != true) {
            if (this.maxTimeoutSeconds != null && this.maxTimeoutSeconds > 0) {
                if (request.pipeOptions == null) {
                    request.pipeOptions = {};
                }
                request.pipeOptions.maxTimeout = this.maxTimeoutSeconds;
            }
            if (((_d = request.pipeOptions) === null || _d === void 0 ? void 0 : _d.maxTimeout) != null) {
                let t = request.pipeOptions.maxTimeout;
                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = (_e = request.pipeOptions) === null || _e === void 0 ? void 0 : _e.cancelToken;
                if (ocancel != null) {
                    cancel.linkToken(ocancel);
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
//# sourceMappingURL=max-timeout-intercepter.js.map