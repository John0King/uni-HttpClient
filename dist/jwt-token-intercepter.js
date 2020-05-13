const AuthKey = "Authorization";
export class JwtTokenIntercepter {
    constructor(tokenFactory) {
        this.tokenFactory = tokenFactory;
    }
    handle(request, next) {
        //console.log(`token intercepter enter`)
        request.header = request.header ?? {};
        // this will disallow this intercepter when Authentication set to null
        if (request.header[AuthKey] === null) {
            delete request.header[AuthKey];
        }
        else if (request.header[AuthKey] === undefined) {
            const token = this.tokenFactory(request.url);
            //console.log(token);
            if (token != null) {
                request.header[AuthKey] = `Bearer ${this.tokenFactory(request.url)}`;
            }
        }
        //return next(request).then(x=> {  x.data = `your json` ; return x;})
        return next(request);
    }
}
//# sourceMappingURL=jwt-token-intercepter.js.map