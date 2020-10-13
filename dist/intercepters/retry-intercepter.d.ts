import { HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext } from '../intercepter';
/**
 * 重试拦截器
 */
export declare class RetryIntercepter implements HttpClientIntercepter {
    defaultRetrycount: number;
    defaultRetryDelay: number;
    constructor(defaultRetrycount?: number, defaultRetryDelay?: number);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
