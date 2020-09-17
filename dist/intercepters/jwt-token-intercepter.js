import { CancelError } from '../errors';
const AuthKey = "Authorization";
export class JwtTokenIntercepter {
    constructor(tokenFactory) {
        this.tokenFactory = tokenFactory;
    }
    handle(request, next) {
        var _a, _b, _c;
        if ((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) {
            if (request.pipeOptions.cancelToken.isCanceled) {
                return new Promise((resolve, reject) => {
                    reject(new CancelError());
                });
            }
        }
        if (((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.preventJwtToken) != true) {
            //console.log(`token intercepter enter`)
            request.header = (_c = request.header) !== null && _c !== void 0 ? _c : {};
            // this will disallow this intercepter when Authentication set to null
            if (request.header[AuthKey] === null) {
                delete request.header[AuthKey];
            }
            else if (request.header[AuthKey] === undefined) {
                const token = this.tokenFactory(request.url);
                //console.log(token);
                if (token instanceof Promise) {
                    return token.then(t => {
                        request.header[AuthKey] = `Bearer ${t}`;
                    }).then(() => next(request));
                }
                else if (token != null) {
                    request.header[AuthKey] = `Bearer ${token}`;
                }
            }
        }
        //return next(request).then(x=> {  x.data = `your json` ; return x;})
        return next(request);
    }
}
//# sourceMappingURL=jwt-token-intercepter.js.map