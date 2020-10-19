import { HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext } from '../intercepter';
export declare class MaxTimeoutIntercepter implements HttpClientIntercepter {
    maxTimeoutSeconds: number;
    constructor(maxTimeoutSeconds?: number);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
