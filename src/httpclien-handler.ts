import { IntercepterRequestContext, IntercepterResponseContext } from "./intercepter";
import { HttpClient } from './httpclient';

/**
 * httpclient 处理终端的接口
 */
export interface IHttpClientHandler {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}



