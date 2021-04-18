import { AutoDomainIntercepter } from './intercepters/auto-domain-intercepter';
import { RetryIntercepter } from './intercepters/retry-intercepter';
import { TimeoutIntercepter } from './intercepters/timeout-interceper';
import { StatusCodeIntercepter } from './intercepters/statuscode-intercepter';
import { MaxTimeoutIntercepter } from './intercepters/max-timeout-intercepter';
import { defaultProfile } from './profiles/default-profile';
import { IntercepterCollection } from './IntercepterCollection';
export class HttpClient {
    /**
     * 构建一个 @see HttpClient 对象
     * @param profiles 一个处理程序的配置对象
     */
    constructor(profiles) {
        this.intercepters = new IntercepterCollection();
        if (profiles == null) {
            profiles = defaultProfile;
        }
        this.profiles = profiles;
    }
    setupDefaults(options) {
        if ((options === null || options === void 0 ? void 0 : options.baseUrl) != null) {
            this.intercepters.push(new AutoDomainIntercepter(url => options.baseUrl));
        }
        if ((options === null || options === void 0 ? void 0 : options.maxTimeout) != null) {
            this.intercepters.push(new MaxTimeoutIntercepter(options.maxTimeout));
        }
        if ((options === null || options === void 0 ? void 0 : options.retryCount) != null && (options === null || options === void 0 ? void 0 : options.retryCount) > 0) {
            this.intercepters.push(new RetryIntercepter(options.retryCount, options === null || options === void 0 ? void 0 : options.retryDelay));
        }
        if ((options === null || options === void 0 ? void 0 : options.timeout) != null) {
            this.intercepters.push(new TimeoutIntercepter(options.timeout));
        }
        if ((options === null || options === void 0 ? void 0 : options.statusCodeError) == true) {
            this.intercepters.push(new StatusCodeIntercepter());
        }
    }
    /**
     * 设置 默认实例 @see httpclient 的拦截器
     * @param option 拦截器配置
     * @deprecated 建议直接调用实例的该方法
     */
    static setupDefaults(options) {
        httpClient.setupDefaults(options);
    }
    get(...args) {
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url,
                data,
                header }, options), { pipeOptions });
        }
        option.method = "GET";
        return this.request(option)
            .then(x => x.data);
    }
    post(...args) {
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, query, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url, data: query, header }, options), { pipeOptions });
        }
        option.method = "POST";
        return this.request(option)
            .then(x => x.data);
    }
    put(...args) {
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url,
                data,
                header }, options), { pipeOptions });
        }
        option.method = "PUT";
        return this.request(option)
            .then(x => x.data);
    }
    form(...args) {
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url,
                data,
                header }, options), { pipeOptions });
        }
        option.method = "POST";
        option.header = Object.assign(Object.assign({}, option.header), { "Content-Type": "application/x-www-form-urlencoded" });
        return this.request(option)
            .then(x => x.data);
    }
    delete(...args) {
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, data, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url,
                data,
                header }, options), { pipeOptions });
        }
        option.method = "DELETE";
        return this.request(option)
            .then(x => x.data);
    }
    uploadFile(...args) {
        let option;
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
            };
        }
        option.method = "POST";
        return this.send(option, this.profiles.upload);
    }
    download(...args) {
        var _a;
        let option;
        if (args.length == 1 && typeof (args[0]) !== "string") {
            option = args[0];
        }
        else {
            let [url, header, options, pipeOptions] = args;
            option = Object.assign(Object.assign({ url,
                header }, options), { pipeOptions });
        }
        (_a = option.method) !== null && _a !== void 0 ? _a : (option.method = "GET");
        return this.send(option, this.profiles.download);
    }
    /**
     * 全能的请求
     * @param url 地址
     * @param method 方法
     * @param data 数据
     * @param header 请求头
     * @param options 其他参数
     */
    request(...args) {
        if (args.length == 1 && typeof (args[0]) !== "string") {
            const op = args[0];
            return this.send(op, this.profiles.request);
        }
        let [url, method, data, header, options, pipeOptions] = args;
        return this.send(Object.assign(Object.assign({ url,
            method,
            data,
            header }, options), { pipeOptions }), this.profiles.request);
    }
    send(request, handler) {
        var _a, _b;
        let pipeline = this.createIntercepterPipeline(handler);
        (_a = request.header) !== null && _a !== void 0 ? _a : (request.header = {});
        (_b = request.pipeOptions) !== null && _b !== void 0 ? _b : (request.pipeOptions = {});
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
        for (let i of [...this.intercepters].reverse()) {
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
export const httpClient = new HttpClient();
//# sourceMappingURL=httpclient.js.map