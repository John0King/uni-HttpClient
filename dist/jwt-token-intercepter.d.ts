import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext } from "./httpclient";
export declare class JwtTokenIntercepter implements HttpClientIntercepter {
    private tokenFactory;
    constructor(tokenFactory: (url: string) => string | null);
    handle(request: IntercepterRequestContext, next: (request: IntercepterRequestContext) => Promise<IntercepterResponseContext>): Promise<IntercepterResponseContext>;
}
