import { ICancelToken } from './cancel-token';
import { IHttpClientHandler } from './httpclien-handler';

export interface PipeOptions {
    cancelToken?: ICancelToken;
    /** 秒数， 必须添加 @see TimeoutIntercepter 才管用 */
    timeout?: number;
    /** 秒数，必须添加 @see MaxTimeoutIntercepter 才管用 */
    maxTimeout?:number;
    /**重试次数，默认为1，会重试1次 */
    retryCount?:number;
    /** 重试间隔 单位毫秒 */
    retryDelay?:number;
    preventTimeout?: boolean;
    preventAutoDomain?: boolean;
    preventJwtToken?: boolean;
    preventStatusCode?: boolean;
    preventRetry?:boolean;
    [key: string]: any;
}

/**
 * 请求返回
 */
export interface ResponseData<T = any,TError = any> {
    statusCode: number;
    data: T;
    error?: TError;
    header: any;
}

export type HttpMethods = "OPTIONS"
            | "GET"
            | "HEAD"
            | "POST"
            | "PUT"
            | "DELETE"
            | "TRACE"
            | "CONNECT";


export type DefaultIntercepterOptions = {
    /** 重试次数 @see RetryIntercepter */
    retryCount?:number;
    /** 重试间隔 单位毫秒 */
    retryDelay?:number;
    /** 超时（秒） */
    timeout?:number;
    /** 最大超时（秒） */
    maxTimeout?:number;
    /**通过 @see AutoDomainIntercepter 来添加默认地址  */
    baseUrl?:string;
    /** 启用 @see StatusCodeIntercepter */
    statusCodeError?:boolean;

    [key:string]:any;
}

export interface HandlerProfiles{
    request: IHttpClientHandler;
    upload:IHttpClientHandler;
    download:IHttpClientHandler;
}

export interface HttpClientRequestOption{
    /**请求地址 */
    url:string;
    /** 请求方式 */
    method?:HttpMethods;
    /** Post 或者 Get 的数据 */
    data?:Record<any,any> | string;
    /** http header */
    header?:Record<any,any>;
    /** 响应数据的类型和方式 */
    responseType?:"text" | "arraybuffer";
    /** 拦截器管道数据和配置 */
    pipeOptions?:PipeOptions;
}
export interface HttpClientGetOption extends HttpClientRequestOption{
    method?:'GET'
}
export interface HttpClientPostOption extends HttpClientRequestOption{
    method?:'POST'
}
export interface HttpClientPutOption extends HttpClientRequestOption{
    method?:'PUT'
}
export interface HttpClientDeleteOption extends HttpClientRequestOption{
    method?:'DELETE'
}

export interface HttpClientUploadOption extends HttpClientRequestOption{
    method?:'POST';
    data: HttpClientUploadData
}

export interface HttpClientUploadData{
    files?: { name: string; uri: string }[];
    fileType?: "image" | "audio" | "video";
    filePath?: string;
    name?: string;
    formData?: any;
    [k:string]:any;
}

export interface HttpClientDownloadOption extends HttpClientRequestOption{
    data:undefined;
}