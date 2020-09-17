import {
    HttpClientIntercepter,
    IntercepterRequestContext,
    IntercepterResponseContext,
    IntercepterDelegate
} from "../intercepter";
import { CancelError } from '../errors';
export class AutoDomainIntercepter implements HttpClientIntercepter {
    /**
     * 
     * @param factory  return a baseurl, not full url
     */
    constructor(public factory: (url: string) => string) { }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if(request.pipeOptions?.cancelToken){
            if(request.pipeOptions.cancelToken.isCanceled){
                return new Promise<IntercepterResponseContext>((resolve,reject)=>{
                    reject(new CancelError());
                })
            }
        }
        if (request.pipeOptions?.preventAutoDomain != true) {

            if (
                request.url.toLowerCase().indexOf("http://") < 0 &&
                request.url.toLowerCase().indexOf("https://") < 0
            ) {
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
