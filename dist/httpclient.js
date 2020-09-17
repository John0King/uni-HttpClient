import { UniRequestHttpClientHander, UniUploadHttpClientHander, UniDownloadHttpClientHander } from './httpclien-handler';
import { AutoDomainIntercepter } from './intercepters/auto-domain-intercepter';
import { RetryIntercepter } from './intercepters/retry-intercepter';
import { TimeoutIntercepter } from './intercepters/timeout-interceper';
import { StatusCodeIntercepter } from './intercepters/statuscode-intercepter';
let HttpClient = /** @class */ (() => {
    class HttpClient {
        /**
         * 一次性设置所有目前存在的拦截器
         * @param option 拦截器配置
         */
        static setupDefaults(option) {
            if ((option === null || option === void 0 ? void 0 : option.retryCount) != null && (option === null || option === void 0 ? void 0 : option.retryCount) > 0) {
                this.intercepters.push(new RetryIntercepter(option.retryCount));
            }
            if ((option === null || option === void 0 ? void 0 : option.baseUrl) != null) {
                this.intercepters.push(new AutoDomainIntercepter(url => option.baseUrl));
            }
            if ((option === null || option === void 0 ? void 0 : option.timeout) != null) {
                this.intercepters.push(new TimeoutIntercepter(option.timeout));
            }
            if ((option === null || option === void 0 ? void 0 : option.statusCodeError) != true) {
                this.intercepters.push(new StatusCodeIntercepter());
            }
        }
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
            let delegate = (req) => new HandlerIntercepter(handler, client).handle(req, null);
            for (let i of [...HttpClient.intercepters].reverse()) {
                let func = (x) => ((req) => i.handle(req, x));
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
    HttpClient.intercepters = [];
    return HttpClient;
})();
export { HttpClient };
export const httpClient = new HttpClient();
//# sourceMappingURL=httpclient.js.map