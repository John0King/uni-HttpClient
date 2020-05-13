export declare class HttpClient {
    static readonly intercepters: HttpClientIntercepter[];
    get<T = any>(url: string, query?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<T>;
    post<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<T>;
    put<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<T>;
    form<T = any>(url: string, data: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<T>;
    delete<T = any>(url: string, data?: object | string, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<T>;
    uploadFile<T = any>(url: string, data: {
        files?: {
            name: string;
            uri: string;
        }[];
        fileType?: "image" | "audio" | "video";
        filePath?: string;
        name?: string;
        formData?: any;
    }, header?: any): Promise<ResponseData<T>>;
    /**
     * 全能的请求
     * @param url 地址
     * @param method 方法
     * @param data 数据
     * @param header 请求头
     * @param options 其他参数
     */
    request(url: string, method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT", data?: any, header?: any, options?: {
        responseType?: "text" | "arraybuffer";
    }): Promise<ResponseData>;
    /**
     * 最基础的 @see uni.request 封装
     * @param req 请求上下文
     */
    private internal_request;
    private internal_uploadFile;
    /**
     * 在 @see  internal_request 的基础上包裹拦截器
     * @param context  拦截请求上下文
     */
    private do_intercepte;
}
export interface HttpClientIntercepter {
    handle(request: IntercepterRequestContext, next: (request: IntercepterRequestContext) => Promise<IntercepterResponseContext>): Promise<IntercepterResponseContext>;
}
export interface IntercepterRequestContext {
    url: string;
    readonly method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
    header?: any;
    data?: any;
    responseType?: "text" | "arraybuffer";
}
export interface IntercepterResponseContext {
    httpClient: HttpClient;
    statusCode: number;
    data: any;
    error?: any;
    header: any;
}
export interface ResponseData<T = any> {
    statusCode: number;
    data: T;
    error?: any;
    header: any;
}
export declare const httpClient: HttpClient;
