import { HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext } from '../intercepter';
/**
 * 重试拦截器
 */
export declare class RetryIntercepter implements HttpClientIntercepter {
    defaultRetrycount: number;
    constructor(defaultRetrycount?: number);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
