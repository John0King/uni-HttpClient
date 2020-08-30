import { HttpClientIntercepter, IntercepterRequestContext, IntercepterDelegate, IntercepterResponseContext } from '@/intercepter';
export declare class TimeoutIntercepter implements HttpClientIntercepter {
    cancelAfterSeconds?: number | undefined;
    /**
     * 支持超时的拦截器
     * @param cancelAfterSeconds 全局超时秒数
     */
    constructor(cancelAfterSeconds?: number | undefined);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
