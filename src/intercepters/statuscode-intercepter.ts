import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from '@/intercepter';
import { StatusCodeError, CancelError } from '@/errors';

/**
 * 如果添加该拦截器， 任何状态码不在200~ 400 之间的状态码将 抛出 @see StatusCodeError
 */
export class StatusCodeIntercepter implements HttpClientIntercepter {
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if(request.pipeOptions?.cancelToken){
            if(request.pipeOptions.cancelToken.isCanceled){
                return new Promise<IntercepterResponseContext>((resolve,reject)=>{
                    reject(new CancelError());
                })
            }
        }
        if(request.pipeOptions?.preventStatusCode != true){
            return next(request)
            .then(res => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    return res;
                }
                else {
                    throw new StatusCodeError(res.statusCode, res)
                }
            })
            .catch(e => { throw e });
        }
        else{
            return next(request);
        }

    }


}