import { IntercepterRequestContext, IntercepterResponseContext } from "./intercepter";
import { HttpClient } from './httpclient';
export interface IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
export declare class UniRequestHttpClientHander implements IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
export declare class UniUploadHttpClientHander implements IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
export declare class UniDownloadHttpClientHander implements IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
