import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from '@/intercepter';
/**
 * 如果添加该拦截器， 任何状态码不在200~ 400 之间的状态码将 抛出 @see StatusCodeError
 */
export declare class StatusCodeIntercepter implements HttpClientIntercepter {
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
