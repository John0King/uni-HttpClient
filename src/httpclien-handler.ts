import { IntercepterRequestContext, IntercepterResponseContext } from "./intercepter";
import { HttpClient } from './httpclient';
import { CancelError } from './errors';

export interface IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext>;
}


export class UniRequestHttpClientHander implements IHttpClientHander {

    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext> {
        const p = new Promise<IntercepterResponseContext>((resolve, reject) => {
            let task = uni.request({
                url: request.url,
                method: request.method,
                data: request.data,
                header: request.header,
                responseType: request.responseType ?? "text",
                success: x => {
                    //     console.log(x);
                    //   if (
                    //     (x.header["content-type"] as string).toLowerCase().indexOf("json") >
                    //     -1
                    //   ) {
                    //     x.data = JSON.parse(x.data!) as any;
                    //   }

                    // uni api automatic do this for us
                    resolve({
                        header: x.header,
                        statusCode: x.statusCode ?? 200,
                        data: x.data,
                        httpClient: httpClient,
                        httpClientHander: this,
                        pipeOptions: request.pipeOptions
                    });
                },
                fail: x => {
                    if(request.pipeOptions?.cancelToken?.isCanceled){
                        reject(new CancelError());
                        return;
                    }
                    reject(x);
                }
            });

            if(request.pipeOptions?.cancelToken){
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x=>task.abort());
            }
        });
        
        return p;
    }

}

export class UniUploadHttpClientHander implements IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext> {
        const p = new Promise<IntercepterResponseContext>((resovle, reject) => {
            let task = uni.uploadFile({
                url: request.url,
                files: request.data?.files,
                fileType: request.data?.fileType,
                filePath: request.data?.filePath,
                name: request?.data.name,
                header: request.header,
                formData: request.data?.formData,

                success: x => {
                    let data = x.data;
                    let header : { [key:string]:string; } = {};
                    //let ct = x2.header?.["Content-Type"] as string;
                    try {
                        data = JSON.parse(data!);
                        header["Content-Type"] = "application/json";
                    } catch (e) {
                        data = data;
                        // 说明不是json, 操蛋的api没法监测header
                    }
                    resovle({
                        statusCode : x.statusCode ?? 200,
                        header: header,
                        data :data,
                        httpClient,
                        httpClientHander: this,
                        pipeOptions: request.pipeOptions
                    });
                },
                fail: e => {
                    if(request.pipeOptions?.cancelToken?.isCanceled){
                        reject(new CancelError());
                        return;
                    }
                    reject(e);
                }
            });

            if(request.pipeOptions?.cancelToken){
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x=>task.abort());
            }
        });
        return p;
    }

}

export class UniDownloadHttpClientHander implements IHttpClientHander {
    send(request: IntercepterRequestContext, httpClient: HttpClient): Promise<IntercepterResponseContext> {
        const p = new Promise<IntercepterResponseContext>((resolve,reject)=>{
            
            let task = uni.downloadFile({
                url: request.url,
                header: request.header,
                success: res=>{
                    resolve({
                        statusCode: res.statusCode ?? 200,
                        header: (res as any).header ?? {},
                        data : res.tempFilePath,
                        httpClientHander: this,
                        httpClient
                    })
                },
                fail: (e)=>{
                    if(request.pipeOptions?.cancelToken?.isCanceled){
                        reject(new CancelError());
                        return;
                    }
                    reject(e);
                }
            });
            if(request.pipeOptions?.cancelToken){
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x=>task.abort());
            }
        })
        return p;
    }

}