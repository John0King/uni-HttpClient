import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from "../intercepter";
export declare class AutoDomainIntercepter implements HttpClientIntercepter {
    factory: (url: string) => string;
    /**
     *
     * @param factory  return a baseurl, not full url
     */
    constructor(factory: (url: string) => string);
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
