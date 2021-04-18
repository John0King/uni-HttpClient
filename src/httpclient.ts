import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from './intercepter';
import { PipeOptions, ResponseData, HttpMethods, DefaultIntercepterOptions, HandlerProfiles, HttpClientGetOption, HttpClientRequestOption, HttpClientPostOption, HttpClientPutOption, HttpClientDeleteOption, HttpClientUploadOption, HttpClientDownloadOption } from './options';
import { IHttpClientHandler } from './httpclien-handler';
import { UniRequestHttpClientHandler, UniUploadHttpClientHandler, UniDownloadHttpClientHandler } from "./handlers/uni-handler";
import { AutoDomainIntercepter } from './intercepters/auto-domain-intercepter';
import { RetryIntercepter } from './intercepters/retry-intercepter';
import { TimeoutIntercepter } from './intercepters/timeout-interceper';
import { StatusCodeIntercepter } from './intercepters/statuscode-intercepter';
import { MaxTimeoutIntercepter } from './intercepters/max-timeout-intercepter';
import { defaultProfile } from './profiles/default-profile';
import { IntercepterCollection } from './IntercepterCollection';

export class HttpClient {
    //static readonly intercepters: HttpClientIntercepter[] = [];
    private profiles: HandlerProfiles;
    public readonly intercepters: IntercepterCollection = new IntercepterCollection();
    /**
     * 构建一个 @see HttpClient 对象
     * @param profiles 一个处理程序的配置对象
     */
    constructor(profiles?: HandlerProfiles) {
        if (profiles == null) {
            profiles = defaultProfile
        }
        this.profiles = profiles;
    }

    setupDefaults(options?: DefaultIntercepterOptions) {
        if (options?.baseUrl != null) {
            this.intercepters.push(new AutoDomainIntercepter(url => options.baseUrl as string))
        }

        if (options?.maxTimeout != null) {
            this.intercepters.push(new MaxTimeoutIntercepter(options.maxTimeout));
        }

        if (options?.retryCount != null && options?.retryCount > 0) {
            this.intercepters.push(new RetryIntercepter(options.retryCount, options?.retryDelay));
        }

        if (options?.timeout != null) {
            this.intercepters.push(new TimeoutIntercepter(options.timeout));
        }

        if (options?.statusCodeError == true) {
            this.intercepters.push(new StatusCodeIntercepter());
        }
    }
    /**
     * 设置 默认实例 @see httpclient 的拦截器
     * @param option 拦截器配置
     * @deprecated 建议直接调用实例的该方法
     */
    static setupDefaults(options?: DefaultIntercepterOptions) {
        httpClient.setupDefaults(options);
    }

    get<T = any>(url: string,
        query?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions): Promise<T>;
    get<T = any>(option: HttpClientGetOption): Promise<T>;
    get<T = any>(...args: any[]): Promise<T> {
        let option: HttpClientGetOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = {
                url,
                data,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method = "GET";

        return this.request(option)
            .then(x => x.data as T);

    }
    post<T = any>(
        url: string,
        data?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T>;
    post<T = any>(option: HttpClientPostOption): Promise<T>;
    post<T = any>(...args: any[]): Promise<T> {

        let option: HttpClientPostOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, query, header, options, pipeOptions] = args;
            option = {
                url,
                data: query,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method = "POST";

        return this.request(option)
            .then(x => x.data as T);
    }
    put<T = any>(
        url: string,
        data: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T>;
    put<T = any>(option: HttpClientPutOption): Promise<T>;
    put<T = any>(...args: any[]): Promise<T> {
        let option: HttpClientPutOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = {
                url,
                data,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method = "PUT";

        return this.request(option)
            .then(x => x.data as T);
    }
    form<T = any>(
        url: string,
        data: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<T>;
    form<T = any>(option: HttpClientPostOption): Promise<T>;
    form<T = any>(...args: any[]): Promise<T> {
        let option: HttpClientPostOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = {
                url,
                data,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method = "POST";
        option.header = { ...option.header, "Content-Type": "application/x-www-form-urlencoded" }

        return this.request(option)
            .then(x => x.data as T);
    }
    delete<T = any>(
        url: string,
        data?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer"
        },
        pipeOptions?: PipeOptions
    ): Promise<T>;
    delete<T = any>(option: HttpClientPutOption): Promise<T>;
    delete<T = any>(...args: any[]): Promise<T> {
        let option: HttpClientDeleteOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = {
                url,
                data,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method = "DELETE";

        return this.request(option)
            .then(x => x.data as T);
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
    ): Promise<ResponseData<T>>
    uploadFile<T = any>(optoin: HttpClientUploadOption): Promise<ResponseData<T>>
    uploadFile<T = any>(...args: any[]): Promise<ResponseData<T>> {
        let option: HttpClientUploadOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, pipeOptions] = args;
            option = {
                url,
                data,
                header,
                pipeOptions,
            }
        }
        option.method = "POST";
        return this.send<T>(option, this.profiles.upload)
    }
    download<T = string>(url: string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer"
        },
        pipeOptions?: PipeOptions): Promise<ResponseData<T>>;
    download<T = string>(): Promise<ResponseData<T>>;
    download<T = string>(...args: any[]): Promise<ResponseData<T>> {
        let option: HttpClientDownloadOption;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, header, options, pipeOptions] = args;
            option = {
                url,
                header,
                ...options,
                pipeOptions,
            }
        }
        option.method ??= "GET";
        return this.send<T>(option, this.profiles.download)
    }
    request<T = any>(
        url: string,
        method: HttpMethods,
        data?: any,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?: PipeOptions
    ): Promise<ResponseData<T>>;
    request<T = any>(option: HttpClientRequestOption): Promise<ResponseData<T>>
    /**
     * 全能的请求
     * @param url 地址
     * @param method 方法
     * @param data 数据
     * @param header 请求头
     * @param options 其他参数
     */
    request<T = any>(...args: any[]): Promise<ResponseData<T>> {
        if (args.length == 1 && typeof (args[0]) !== "string") {
            const op: HttpClientRequestOption = args[0];
            return this.send<T>(op, this.profiles.request);
        }
        let [url, method, data, header, options, pipeOptions] = args;
        return this.send<T>({
            url,
            method,
            data,
            header,
            ...options,
            pipeOptions
        }, this.profiles.request);

    }

    send<T = any>(request: IntercepterRequestContext | { pipeOptions?: PipeOptions,[k:string]:any }, handler: IHttpClientHandler): Promise<ResponseData<T>> {
        let pipeline = this.createIntercepterPipeline(handler);
        request.header ??= {};
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

        for (let i of [...this.intercepters].reverse()) {
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
