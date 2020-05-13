import {
    HttpClientIntercepter,
    IntercepterRequestContext,
    IntercepterResponseContext
} from "./httpclient";
export class AutoDomainIntercepter implements HttpClientIntercepter {
    constructor(public factory: (url: string) => string) {}

    handle(
        request: IntercepterRequestContext,
        next: (
            request: IntercepterRequestContext
        ) => Promise<IntercepterResponseContext>
    ): Promise<IntercepterResponseContext> {
        if (
            request.url.toLowerCase().indexOf("http://") < 0 &&
            request.url.toLowerCase().indexOf("https://") < 0
        ) {
            //console.log(`auto domain intercepter enter`);
            if (request.url[0] != "/") {
                request.url = "/" + request.url;
            }
            let baseUrl = this.factory(request.url);
            if (baseUrl.lastIndexOf("/") == 0) {
                baseUrl = baseUrl.substr(0, baseUrl.length - 1);
            }
            request.url = baseUrl + request.url;
        }

        //return next(request).then(x=> {  x.data = `your json` ; return x;})
        return next(request);
    }
}
