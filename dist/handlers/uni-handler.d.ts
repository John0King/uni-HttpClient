import { IntercepterRequestContext, IntercepterResponseContext } from "../intercepter";
import { HttpClient } from '../httpclient';
import { IHttpClientHandler } from "../httpclien-handler";
/** uni 的 GET POST PUT OPTION 等操作的 处理终端 */
export declare class UniRequestHttpClientHandler implements IHttpClientHandler {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
/** uni 的 上传文件 操作的 处理终端 */
export declare class UniUploadHttpClientHandler implements IHttpClientHandler {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
/** uni 的 下载文件 操作的 处理终端 */
export declare class UniDownloadHttpClientHandler implements IHttpClientHandler {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}
