import { HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext } from '../intercepter';

/**
 * 重试拦截器
 */
export class RetryIntercepter implements HttpClientIntercepter {
    constructor(public defaultRetrycount: number = 1) {
    }

    async handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if (request.pipeOptions?.preventRetry == true || request.pipeOptions?.retryCount == 0) {
            return await next(request);
        }
        let retryCount = request.pipeOptions?.retryCount ?? this.defaultRetrycount;
        let current = 0;
        let response: IntercepterResponseContext;
        try {
            do {
                try {
                    response = await next(request);
                    return response;
                }
                catch (e) {
                    if (current < retryCount) {
                        console.log(`error:retrying...`)
                    }
                    else {
                        console.log(`error:done retrying.`)
                    }
                    console.log(e);
                    if(current >= retryCount){
                        throw e;
                    }
                    
                }
                current += 1;
            } while (true)
        }
        catch (e) {
            throw e;
        }
    }

}