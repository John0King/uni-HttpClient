import { HttpClientIntercepter, IntercepterRequestContext } from './intercepter';
import { PipeOptions, ResponseData, HttpMethods } from './options';
import { IHttpClientHander } from './httpclien-handler';
export declare class HttpClient {
    static readonly intercepters: HttpClientIntercepter[];
    get<T = any>(url: string, query?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    post<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    put<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    form<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    delete<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    uploadFile<T = any>(url: string, data: {
        files?: {
            name: string;
            uri: string;
        }[];
        fileType?: "image" | "audio" | "video";
        filePath?: string;
        name?: string;
        formData?: any;
    }, header?: any, pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    download<T = string>(url: string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    /**
     * 全能的请求
     * @param url 地址
     * @param method 方法
     * @param data 数据
     * @param header 请求头
     * @param options 其他参数
     */
    request<T = any>(url: string, method: HttpMethods, data?: any, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    send<T = any>(request: IntercepterRequestContext, handler: IHttpClientHander): Promise<ResponseData<T>>;
    private createIntercepterPipeline;
}
export declare const httpClient: HttpClient;
