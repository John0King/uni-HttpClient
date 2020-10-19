import { HttpClientIntercepter, IntercepterRequestContext, IntercepterDelegate, IntercepterResponseContext } from '../intercepter';
import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';

export class TimeoutIntercepter implements HttpClientIntercepter {

    private readonly _key = "__timeoutintercepter_attached"; 

    /**
     * 支持超时的拦截器
     * @param cancelAfterSeconds 全局超时秒数
     */
    constructor(public cancelAfterSeconds?: number) {

    }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if (request.pipeOptions?.cancelToken && request.pipeOptions?.[this._key] != true) {
            // 如果已经取消，那就直接返回错误
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise<IntercepterResponseContext>((resolve, reject) => {
                    reject(new CancelError());
                })
            }
        }
        if (request.pipeOptions?.preventTimeout != true) {
            if (this.cancelAfterSeconds != null && this.cancelAfterSeconds > 0) {
                if (request.pipeOptions == null) {
                    request.pipeOptions = {};
                    request.pipeOptions.timeout = this.cancelAfterSeconds;
                }
                
            }

            if (request.pipeOptions?.timeout != null) {
                let t = request.pipeOptions.timeout;

                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = request.pipeOptions?.[this._key] == true ? request.pipeOptions?.__timeoutintercepter_ocancel : request.pipeOptions?.cancelToken;
                if (ocancel != null) {
                    cancel.linkToken(ocancel);
                    request.pipeOptions.__timeoutintercepter_ocancel = ocancel;
                }
                request.pipeOptions.cancelToken = cancel;
                // 通过注入这个属性，来通知自己下次的 token 是自己的
                request.pipeOptions[this._key] = true;
                return next(request).then(x => {
                    cancel.stopCancel();
                    if(request.pipeOptions !=null){
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
