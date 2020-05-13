let HttpClient = /** @class */ (() => {
    class HttpClient {
        get(url, query, header, options) {
            return this.request(url, "GET", query, header, options)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        post(url, data, header, options) {
            return this.request(url, "POST", data, header, options)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        put(url, data, header, options) {
            return this.request(url, "PUT", data, header, options)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        form(url, data, header, options) {
            return this.request(url, "POST", data, { ...header, "Content-Type": "application/x-www-form-urlencoded" }, options)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        delete(url, data, header, options) {
            return this.request(url, "DELETE", data, header, options)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        uploadFile(url, data, header) {
            return this.do_intercepte({
                url,
                method: "POST",
                header
            }, new FinalIntercepter(rcontext => {
                return this.internal_uploadFile(rcontext, {
                    files: data.files,
                    fileType: data.fileType,
                    filePath: data.filePath,
                    name: data.name,
                    formData: data.formData
                });
            }, this))
                .then(x => {
                return {
                    statusCode: x.statusCode,
                    data: x.data,
                    header: x.header
                };
            })
                .catch(e => {
                throw e;
            });
        }
        /**
         * 全能的请求
         * @param url 地址
         * @param method 方法
         * @param data 数据
         * @param header 请求头
         * @param options 其他参数
         */
        request(url, method, data, header, options) {
            return this.do_intercepte({
                url,
                method,
                data,
                header,
                responseType: options?.responseType ?? undefined
            }, new FinalIntercepter(rcontext => {
                return this.internal_request(rcontext);
            }, this))
                .then(x => {
                return {
                    statusCode: x.statusCode,
                    data: x.data,
                    header: x.header
                };
            })
                .catch(e => {
                throw e;
            });
        }
        /**
         * 最基础的 @see uni.request 封装
         * @param req 请求上下文
         */
        internal_request(req) {
            const p = new Promise((resolve, reject) => {
                uni.request({
                    url: req.url,
                    method: req.method,
                    data: req.data,
                    header: req.header,
                    responseType: req.responseType ?? "text",
                    success: x => {
                        //     console.log(x);
                        //   if (
                        //     (x.header["content-type"] as string).toLowerCase().indexOf("json") >
                        //     -1
                        //   ) {
                        //     x.data = JSON.parse(x.data!) as any;
                        //   }
                        resolve({ ...x, httpClient: this });
                    },
                    fail: x => {
                        reject(x);
                    }
                });
            });
            return p;
        }
        internal_uploadFile(req, upload) {
            const p = new Promise((resovle, reject) => {
                uni.uploadFile({
                    url: req.url,
                    files: upload.files,
                    fileType: upload.fileType,
                    filePath: upload.filePath,
                    name: upload.name,
                    header: req.header,
                    formData: upload.formData,
                    success: x => {
                        let data = x.data;
                        let x2 = x;
                        let ct = x2.header?.["Content-Type"];
                        try {
                            data = JSON.parse(data);
                        }
                        catch (e) {
                            data = data;
                            // 说明不是json, 操蛋的api没法监测header
                        }
                        x2.data = data;
                        resovle({
                            ...x2,
                            httpClient: this
                        });
                    },
                    fail: e => {
                        reject(e);
                    }
                });
            });
            return p;
        }
        /**
         * 在 @see  internal_request 的基础上包裹拦截器
         * @param context  拦截请求上下文
         */
        do_intercepte(context, finalIntercepter) {
            let pipe = [...HttpClient.intercepters, finalIntercepter];
            let i = -1;
            return chain(context);
            function chain(context) {
                i++;
                let p = pipe[i].handle(context, chain);
                return p;
            }
        }
    }
    HttpClient.intercepters = [];
    return HttpClient;
})();
export { HttpClient };
class FinalIntercepter {
    constructor(requestHandler, httpClient) {
        this.requestHandler = requestHandler;
        this.httpClient = httpClient;
    }
    handle(request, next) {
        return this.requestHandler(request).then(r => {
            return {
                httpClient: this.httpClient,
                statusCode: r?.statusCode ?? 0,
                header: r.header,
                data: r.data,
                error: null
            };
        });
    }
}
export const httpClient = new HttpClient();
//# sourceMappingURL=httpclient.js.map