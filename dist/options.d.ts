import { ICancelToken } from './cancel-token';
export interface PipeOptions {
    cancelToken?: ICancelToken;
    /** 秒数， 必须添加 超时拦截器才管用 */
    timeout?: number;
    /**重试次数，默认为1，会重试1次 */
    retryCount?: number;
    preventTimeout?: boolean;
    preventAutoDomain?: boolean;
    preventJwtToken?: boolean;
    preventStatusCode?: boolean;
    preventRetry?: boolean;
    [key: string]: any;
}
/**
 * 请求返回
 */
export interface ResponseData<T = any, TError = any> {
    statusCode: number;
    data: T;
    error?: TError;
    header: any;
}
export declare type HttpMethods = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
export declare type DefaultIntercepterOptions = {
    /** 重试次数 @see RetryIntercepter */
    retryCount?: number;
    /** 超时（秒） */
    timeout?: number;
    /**通过 @see AutoDomainIntercepter 来添加默认地址  */
    baseUrl?: string;
    /** 启用 @see StatusCodeIntercepter */
    statusCodeError?: boolean;
    [key: string]: any;
};
