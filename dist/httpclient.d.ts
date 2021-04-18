import { IntercepterRequestContext } from './intercepter';
import { PipeOptions, ResponseData, HttpMethods, DefaultIntercepterOptions, HandlerProfiles, HttpClientGetOption, HttpClientRequestOption, HttpClientPostOption, HttpClientPutOption, HttpClientUploadOption } from './options';
import { IHttpClientHandler } from './httpclien-handler';
import { IntercepterCollection } from './IntercepterCollection';
export declare class HttpClient {
    private profiles;
    readonly intercepters: IntercepterCollection;
    /**
     * 构建一个 @see HttpClient 对象
     * @param profiles 一个处理程序的配置对象
     */
    constructor(profiles?: HandlerProfiles);
    setupDefaults(options?: DefaultIntercepterOptions): void;
    /**
     * 设置 默认实例 @see httpclient 的拦截器
     * @param option 拦截器配置
     * @deprecated 建议直接调用实例的该方法
     */
    static setupDefaults(options?: DefaultIntercepterOptions): void;
    get<T = any>(url: string, query?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    get<T = any>(option: HttpClientGetOption): Promise<T>;
    post<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    post<T = any>(option: HttpClientPostOption): Promise<T>;
    put<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    put<T = any>(option: HttpClientPutOption): Promise<T>;
    form<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    form<T = any>(option: HttpClientPostOption): Promise<T>;
    delete<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<T>;
    delete<T = any>(option: HttpClientPutOption): Promise<T>;
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
    uploadFile<T = any>(optoin: HttpClientUploadOption): Promise<ResponseData<T>>;
    download<T = string>(url: string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    download<T = string>(): Promise<ResponseData<T>>;
    request<T = any>(url: string, method: HttpMethods, data?: any, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }, pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    request<T = any>(option: HttpClientRequestOption): Promise<ResponseData<T>>;
    send<T = any>(request: IntercepterRequestContext | {
        pipeOptions?: PipeOptions;
        [k: string]: any;
    }, handler: IHttpClientHandler): Promise<ResponseData<T>>;
    private createIntercepterPipeline;
}
export declare const httpClient: HttpClient;
