import { HttpClientIntercepter, IntercepterRequestContext, IntercepterDelegate, IntercepterResponseContext } from '../intercepter';
import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';

export class TimeoutIntercepter implements HttpClientIntercepter {

    /**
     * 支持超时的拦截器
     * @param cancelAfterSeconds 全局超时秒数
     */
    constructor(public cancelAfterSeconds?:number){

    }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if(request.pipeOptions?.cancelToken){
            if(request.pipeOptions.cancelToken.isCanceled){
                return new Promise<IntercepterResponseContext>((resolve,reject)=>{
                    reject(new CancelError());
                })
            }
        }
        if (request.pipeOptions?.preventTimeout != true) {
            if(this.cancelAfterSeconds != null && this.cancelAfterSeconds > 0){
                if(request.pipeOptions == null){
                    request.pipeOptions = {};
                }
                request.pipeOptions.timeout = this.cancelAfterSeconds;
            }

            if (request.pipeOptions?.timeout != null) {
                let t = request.pipeOptions.timeout;
                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = request.pipeOptions?.cancelToken;
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
