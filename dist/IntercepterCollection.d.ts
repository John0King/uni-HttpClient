import { HttpClientIntercepter } from "./intercepter";
export declare class IntercepterCollection extends Array<HttpClientIntercepter> {
    insertBefore<T extends HttpClientIntercepter>(type: Type<T>, value: HttpClientIntercepter): void;
    insertAfter<T extends HttpClientIntercepter>(type: Type<T>, value: HttpClientIntercepter): void;
}
interface Type<T = any> {
    new (...args: any[]): T;
}
export {};
