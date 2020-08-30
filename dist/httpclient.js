import { UniRequestHttpClientHander, UniUploadHttpClientHander, UniDownloadHttpClientHander } from './httpclien-handler';
let HttpClient = /** @class */ (() => {
    class HttpClient {
        get(url, query, header, options, pipeOptions) {
            return this.request(url, "GET", query, header, options, pipeOptions)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        post(url, data, header, options, pipeOptions) {
            return this.request(url, "POST", data, header, options, pipeOptions)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        put(url, data, header, options, pipeOptions) {
            return this.request(url, "PUT", data, header, options, pipeOptions)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        form(url, data, header, options, pipeOptions) {
            return this.request(url, "POST", data, Object.assign(Object.assign({}, header), { "Content-Type": "application/x-www-form-urlencoded" }), options, pipeOptions)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        delete(url, data, header, options, pipeOptions) {
            return this.request(url, "DELETE", data, header, options, pipeOptions)
                .then(x => x.data)
                .catch(e => {
                throw e;
            });
        }
        uploadFile(url, data, header, pipeOptions) {
            return this.send({
                url,
                method: "POST",
                data,
                header,
                pipeOptions
            }, new UniUploadHttpClientHander());
        }
        download(url, header, options, pipeOptions) {
            return this.send({
                method: "GET",
                url,
                header,
                responseType: options === null || options === void 0 ? void 0 : options.responseType,
                pipeOptions
            }, new UniDownloadHttpClientHander());
        }
        /**
         * 全能的请求
         * @param url 地址
         * @param method 方法
         * @param data 数据
         * @param header 请求头
         * @param options 其他参数
         */
        request(url, method, data, header, options, pipeOptions) {
            return this.send({
                url,
                method,
                data,
                header,
                responseType: options === null || options === void 0 ? void 0 : options.responseType,
                pipeOptions
            }, new UniRequestHttpClientHander());
        }
        send(request, handler) {
            let pipeline = this.createIntercepterPipeline(handler);
            return pipeline(request);
        }
        createIntercepterPipeline(handler) {
            let client = this;
            class HandlerIntercepter {
                constructor(handler, client) {
                    this.handler = handler;
                    this.client = client;
                }
                handle(request, next) {
                    return this.handler.send(request, this.client);
                }
            }
            let pipe = [...HttpClient.intercepters, new HandlerIntercepter(handler, client)];
            let i = -1;
            let chain = (request) => {
                i++;
                let p = pipe[i].handle(request, chain);
                return p;
            };
            return chain;
        }
    }
    HttpClient.intercepters = [];
    return HttpClient;
})();
export { HttpClient };
export const httpClient = new HttpClient();
//# sourceMappingURL=httpclient.js.map