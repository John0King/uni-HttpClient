import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext, IntercepterDelegate } from "../intercepter";
import { CancelError } from '../errors';
const AuthKey = "Authorization";
export class JwtTokenIntercepter implements HttpClientIntercepter {

    constructor(private tokenFactory: (url: string) => string | null | Promise<string>) {

    }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        if(request.pipeOptions?.cancelToken){
            if(request.pipeOptions.cancelToken.isCanceled){
                return new Promise<IntercepterResponseContext>((resolve,reject)=>{
                    reject(new CancelError());
                })
            }
        }
        if (request.pipeOptions?.preventJwtToken != true) {
            //console.log(`token intercepter enter`)
            request.header = request.header ?? {};
            // this will disallow this intercepter when Authentication set to null
            if (request.header[AuthKey] === null) {
                delete request.header[AuthKey];
            }
            else if (request.header[AuthKey] === undefined) {
                const token = this.tokenFactory(request.url);
                //console.log(token);
                if( token instanceof Promise){
                    return token.then(t=>{
                        request.header[AuthKey] = `Bearer ${t}`
                    }).then(()=> next(request));
                }
                else if (token != null) {
                    request.header[AuthKey] = `Bearer ${token}`
                }

            }
        }


        //return next(request).then(x=> {  x.data = `your json` ; return x;})
        return next(request);

    }


}
