import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from "@/intercepter";
export declare class JwtTokenIntercepter implements HttpClientIntercepter {
    private tokenFactory;
    constructor(tokenFactory: (url: string) => string | null | Promise<string>);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
