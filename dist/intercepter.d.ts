import { HttpClient } from './httpclient';
import { PipeOptions, HttpMethods } from "./options";
import { IHttpClientHander } from './httpclien-handler';
export interface HttpClientIntercepter {
    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext>;
}
export interface IntercepterRequestContext {
    url: string;
    readonly method: HttpMethods;
    header?: any;
    data?: any;
    responseType?: "text" | "arraybuffer";
    pipeOptions: PipeOptions;
}
export interface IntercepterResponseContext {
    httpClient: HttpClient;
    httpClientHander: IHttpClientHander;
    statusCode: number;
    data: any;
    error?: any;
    header: any;
    pipeOptions: PipeOptions;
}
export interface IntercepterDelegate {
    (request: IntercepterRequestContext): Promise<IntercepterResponseContext>;
}
