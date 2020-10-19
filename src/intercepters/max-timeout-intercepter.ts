import { CancelToken } from '../cancel-token';
import { CancelError } from '../errors';
import { Task } from '../task/task';
import { HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext } from '../intercepter';

export class MaxTimeoutIntercepter implements HttpClientIntercepter{

    constructor(public maxTimeoutSeconds:number = 30){

    }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if(request?.pipeOptions?.cancelToken?.isCanceled){
            return Task.fromError<IntercepterResponseContext>(new CancelError())
        }
        
        if (request.pipeOptions?.preventTimeout != true) {
            if (this.maxTimeoutSeconds != null && this.maxTimeoutSeconds > 0) {
                if (request.pipeOptions == null) {
                    request.pipeOptions = {};
                }
                request.pipeOptions.maxTimeout = this.maxTimeoutSeconds;
            }

            if (request.pipeOptions?.maxTimeout != null) {
                let t = request.pipeOptions.maxTimeout;

                t = t * 1000;
                let cancel = new CancelToken(t);
                let ocancel = request.pipeOptions?.cancelToken;
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
