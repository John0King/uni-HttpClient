/**
 * 重试拦截器
 */
export class RetryIntercepter {
    constructor(defaultRetrycount = 1) {
        this.defaultRetrycount = defaultRetrycount;
    }
    async handle(request, next) {
        var _a, _b, _c, _d;
        if (((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.preventRetry) == true || ((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.retryCount) == 0) {
            return await next(request);
        }
        let retryCount = (_d = (_c = request.pipeOptions) === null || _c === void 0 ? void 0 : _c.retryCount) !== null && _d !== void 0 ? _d : this.defaultRetrycount;
        let current = 0;
        let response;
        try {
            do {
                try {
                    response = await next(request);
                    return response;
                }
                catch (e) {
                    if (current < retryCount) {
                        console.log(`error:retrying...`);
                    }
                    else {
                        console.log(`error:done retrying.`);
                    }
                    console.log(e);
                    if (current >= retryCount) {
                        throw e;
                    }
                }
                current += 1;
            } while (true);
        }
        catch (e) {
            throw e;
        }
    }
}
//# sourceMappingURL=retry-intercepter.js.map