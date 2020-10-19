import { Task } from '../task/task';
import { CancelError } from '../errors';
/**
 * 重试拦截器
 */
export class RetryIntercepter {
    constructor(defaultRetrycount = 1, defaultRetryDelay = 1000) {
        this.defaultRetrycount = defaultRetrycount;
        this.defaultRetryDelay = defaultRetryDelay;
    }
    async handle(request, next) {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.preventRetry) == true || ((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.retryCount) == 0) {
            return await next(request);
        }
        let retryCount = (_d = (_c = request.pipeOptions) === null || _c === void 0 ? void 0 : _c.retryCount) !== null && _d !== void 0 ? _d : this.defaultRetrycount;
        let retryDelay = (_f = (_e = request.pipeOptions) === null || _e === void 0 ? void 0 : _e.retryDelay) !== null && _f !== void 0 ? _f : this.defaultRetryDelay;
        let current = 0;
        let response;
        try {
            do {
                try {
                    response = await next(request);
                    return response;
                }
                catch (e) {
                    if (e instanceof CancelError) {
                        console.log(`retry cancel`);
                        throw e;
                    }
                    if (current < retryCount) {
                        console.log(`error:retrying(${current}/${retryCount})...`);
                    }
                    else {
                        console.log(`error:done retrying(${current}/${retryCount}).`);
                    }
                    console.log(e);
                    if (typeof retryDelay === "number") {
                        await Task.delay(retryDelay);
                    }
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