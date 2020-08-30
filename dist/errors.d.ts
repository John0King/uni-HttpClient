import { ResponseData } from './options';
/**
 * 状态码错误
 */
export declare class StatusCodeError extends Error {
    statusCode: number;
    respose?: ResponseData<any, any> | undefined;
    private __proto__;
    constructor(statusCode: number, respose?: ResponseData<any, any> | undefined);
    static messageMap: {
        [key: number]: {
            label: string;
            display?: string;
        };
    };
    static getMessage(statusCode: number): string;
    getDisplayMessage(): string;
}
export declare class CancelError extends Error {
    private __proto__;
    constructor(message?: string);
    isCancelError: boolean;
}
