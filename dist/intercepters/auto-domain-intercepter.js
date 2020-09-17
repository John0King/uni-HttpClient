import { CancelError } from '../errors';
export class AutoDomainIntercepter {
    /**
     *
     * @param factory  return a baseurl, not full url
     */
    constructor(factory) {
        this.factory = factory;
    }
    handle(request, next) {
        var _a, _b;
        if ((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) {
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise((resolve, reject) => {
                    reject(new CancelError());
                });
            }
        }
        if (((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.preventAutoDomain) != true) {
            if (request.url.toLowerCase().indexOf("http://") < 0 &&
                request.url.toLowerCase().indexOf("https://") < 0) {
                //console.log(`auto domain intercepter enter`);
                if (request.url[0] != "/") {
                    request.url = "/" + request.url;
                }
                let baseUrl = this.factory(request.url);
                if (baseUrl.lastIndexOf("/") == (baseUrl.length - 1)) {
                    baseUrl = baseUrl.substr(0, baseUrl.length - 1);
                }
                request.url = baseUrl + request.url;
            }
            //return next(request).then(x=> {  x.data = `your json` ; return x;})
        }
        return next(request);
    }
}
//# sourceMappingURL=auto-domain-intercepter.js.map