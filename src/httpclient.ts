import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from './intercepter';
import { PipeOptions, ResponseData, HttpMethods, DefaultIntercepterOptions } from './options';
import { IHttpClientHandler } from './httpclien-handler';
import { UniRequestHttpClientHandler, UniUploadHttpClientHandler, UniDownloadHttpClientHandler } from "./handlers/uni-handler";
import { AutoDomainIntercepter } from './intercepters/auto-domain-intercepter';
import { RetryIntercepter } from './intercepters/retry-intercepter';
import { TimeoutIntercepter } from './intercepters/timeout-interceper';
import { StatusCodeIntercepter } from './intercepters/statuscode-intercepter';
import { MaxTimeoutIntercepter } from './intercepters/max-timeout-intercepter';

export class HttpClient {
    static readonly intercepters: HttpClientIntercepter[] = [];

    /**
     * 一次性设置所有目前存在的拦截器
     * @param option 拦截器配置
     */
    static setupDefaults(option?: DefaultIntercepterOptions) {
        if (option?.baseUrl != null) {
            this.intercepters.push(new AutoDomainIntercepter(url => option.baseUrl as string))
        }

        if (option?.maxTimeout != null) {
            this.intercepters.push(new MaxTimeoutIntercepter(option.maxTimeout));
        }

        if (option?.retryCount != null && option?.retryCount > 0) {
            this.intercepters.push(new RetryIntercepter(option.retryCount, option?.retryDelay));
        }
        
        if (option?.timeout != null) {
            this.intercepters.push(new TimeoutIntercepter(option.timeout));
        }

        if (option?.statusCodeError == true) {
            this.intercepters.push(new StatusCodeIntercepter());
        }
    }

    get<T = any>(
        url: string,
        query?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T> {
        return this.request(url, "GET", query, header, options, pipeOptions)
            .then(x => x.data as T)
            .catch(e => {
                throw e;
            });
    }

    post<T = any>(
        url: string,
        data?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T> {
        return this.request(url, "POST", data, header, options, pipeOptions)
            .then(x => x.data)
            .catch(e => {
                throw e;
            });
    }

    put<T = any>(
        url: string,
        data: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T> {
        return this.request(url, "PUT", data, header, options, pipeOptions)
            .then(x => x.data)
            .catch(e => {
                throw e;
            });
    }

    form<T = any>(
        url: string,
        data: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T> {
        return this.request(
            url,
            "POST",
            data,
            { ...header, "Content-Type": "application/x-www-form-urlencoded" },
            options,
            pipeOptions
        )
            .then(x => x.data)
            .catch(e => {
                throw e;
            });
    }

    delete<T = any>(
        url: string,
        data?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer"
        },
        pipeOptions?: PipeOptions
    ): Promise<T> {
        return this.request<T>(url, "DELETE", data, header, options, pipeOptions)
            .then(x => x.data)
            .catch(e => {
                throw e;
            });
    }

    uploadFile<T = any>(
        url: string,
        data: {
            files?: { name: string; uri: string }[];
            fileType?: "image" | "audio" | "video";
            filePath?: string;
            name?: string;
            formData?: any;
        },
        header?: any,
        pipeOptions?: PipeOptions
    ): Promise<ResponseData<T>> {
        return this.send<T>({
            url,
            method: "POST",
            data,
            header,
            pipeOptions
        }, new UniUploadHttpClientHandler())
    }

    download<T = string>(url: string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer"
        },
        pipeOptions?: PipeOptions): Promise<ResponseData<T>> {
        return this.send<T>({
            method: "GET",
            url,
            header,
            responseType: options?.responseType,
            pipeOptions
        }, new UniDownloadHttpClientHandler())
    }

    /**
     * 全能的请求
     * @param url 地址
     * @param method 方法
     * @param data 数据
     * @param header 请求头
     * @param options 其他参数
     */
    request<T = any>(
        url: string,
        method: HttpMethods,
        data?: any,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<ResponseData<T>> {
        return this.send<T>({
            url,
            method,
            data,
            header,
            responseType: options?.responseType,
            pipeOptions
        }, new UniRequestHttpClientHandler());

    }

    send<T = any>(request: IntercepterRequestContext | { pipeOptions?: PipeOptions }, handler: IHttpClientHandler): Promise<ResponseData<T>> {
        let pipeline = this.createIntercepterPipeline(handler);
        request.pipeOptions ??= {};
        return pipeline(request as IntercepterRequestContext);
    }

    private createIntercepterPipeline(handler: IHttpClientHandler): IntercepterDelegate {

        let client = this;
        class HandlerIntercepter implements HttpClientIntercepter {
            constructor(private handler: IHttpClientHandler, private client: HttpClient) { }
            handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
                return this.handler.send(request, this.client);
            }

        }

        let delegate: IntercepterDelegate = (req) => new HandlerIntercepter(handler, client).handle(req, null as any);

        for (let i of [...HttpClient.intercepters].reverse()) {
            let func = (x: IntercepterDelegate) => ((req: IntercepterRequestContext) => i.handle(req, x))
            delegate = func(delegate);
        }

        // let pipe = [...HttpClient.intercepters, new HandlerIntercepter(handler, client)];

        // let i = -1;


        // let chain = (request: IntercepterRequestContext) =>{
        //     i++;
        //     let p = pipe[i].handle(request, chain);
        //     return p;
        // }
        // return chain;
        return delegate;
    }
}


export const httpClient = new HttpClient();
