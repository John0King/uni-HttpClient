import { ICancelToken } from './cancel-token';

export interface PipeOptions {
    cancelToken?: ICancelToken;
    /** 秒数， 必须添加 超时拦截器才管用 */
    timeout?: number;
    preventTimeout?: boolean;
    preventAutoDomain?: boolean;
    preventJwtToken?: boolean;
    preventStatusCode?: boolean;
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