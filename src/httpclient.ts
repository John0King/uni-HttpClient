import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from './intercepter';
import { PipeOptions, ResponseData, HttpMethods } from './options';
import { IHttpClientHander, UniRequestHttpClientHander, UniUploadHttpClientHander, UniDownloadHttpClientHander } from './httpclien-handler';

export class HttpClient {
    static readonly intercepters: HttpClientIntercepter[] = [];

    get<T = any>(
        url: string,
        query?: object | string,
        header?: any,
        options?: {
            responseType?: "text" | "arraybuffer";
        },
        pipeOptions?:PipeOptions
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
        pipeOptions?:PipeOptions
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
        pipeOptions?:PipeOptions
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
        pipeOptions?:PipeOptions
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
        pipeOptions?:PipeOptions
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
        pipeOptions?:PipeOptions
    ): Promise<ResponseData<T>> {
        return this.send<T>({
            url,
            method:"POST",
            data,
            header,
            pipeOptions
        }, new UniUploadHttpClientHander())
    }

    download<T = string>(url: string,
        header?:any,
        options?:{
            responseType?:"text"|"arraybuffer"
        },
        pipeOptions?:PipeOptions):Promise<ResponseData<T>>{
            return this.send<T>({
                method:"GET",
                url,
                header,
                responseType: options?.responseType,
                pipeOptions
            }, new UniDownloadHttpClientHander())
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
        pipeOptions?:PipeOptions
    ): Promise<ResponseData<T>> {
        return this.send<T>({
            url,
            method,
            data,
            header,
            responseType: options?.responseType,
            pipeOptions
            }, new UniRequestHttpClientHander()); 
           
    }

    send<T=any>(request: IntercepterRequestContext, handler:IHttpClientHander):Promise<ResponseData<T>>{
        let pipeline = this.createIntercepterPipeline(handler);
        return pipeline(request);
    }

    private createIntercepterPipeline(handler:IHttpClientHander):IntercepterDelegate{
        
        let client   = this;
        class HandlerIntercepter implements HttpClientIntercepter {
            constructor(private handler:IHttpClientHander, private client:HttpClient){}
            handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
                return this.handler.send(request, this.client);
            }
            
        }
        let pipe = [...HttpClient.intercepters, new HandlerIntercepter(handler, client)];
        
        let i = -1;

        
        let chain = (request: IntercepterRequestContext) =>{
            i++;
            let p = pipe[i].handle(request, chain);
            return p;
        }
        return chain;
    }
}


export const httpClient = new HttpClient();
