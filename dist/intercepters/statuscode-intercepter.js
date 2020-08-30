import { StatusCodeError, CancelError } from '@/errors';
/**
 * 如果添加该拦截器， 任何状态码不在200~ 400 之间的状态码将 抛出 @see StatusCodeError
 */
export class StatusCodeIntercepter {
    handle(request, next) {
        var _a, _b;
        if ((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) {
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise((resolve, reject) => {
                    reject(new CancelError());
                });
            }
        }
        if (((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.preventStatusCode) != true) {
            return next(request)
                .then(res => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    return res;
                }
                else {
                    throw new StatusCodeError(res.statusCode, res);
                }
            })
                .catch(e => { throw e; });
        }
        else {
            return next(request);
        }
    }
}
//# sourceMappingURL=statuscode-intercepter.js.map