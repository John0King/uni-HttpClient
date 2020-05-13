import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext } from "./httpclient";
export declare class AutoDomainIntercepter implements HttpClientIntercepter {
    factory: (url: string) => string;
    constructor(factory: (url: string) => string);
    handle(request: IntercepterRequestContext, next: (request: IntercepterRequestContext) => Promise<IntercepterResponseContext>): Promise<IntercepterResponseContext>;
}
