import { HttpClientIntercepter, IntercepterRequestContext, IntercepterResponseContext } from "./httpclient";
const AuthKey = "Authorization";
export class JwtTokenIntercepter implements HttpClientIntercepter{

    constructor(private tokenFactory:(url:string)=>string | null){

    }

    handle(
        request:IntercepterRequestContext,
        next: (request:IntercepterRequestContext)=> Promise<IntercepterResponseContext>):Promise<IntercepterResponseContext> {

        //console.log(`token intercepter enter`)
        request.header = request.header ?? {};
        // this will disallow this intercepter when Authentication set to null
        if(request.header[AuthKey] === null){
          delete request.header[AuthKey];
        }
        else if( request.header[AuthKey] === undefined){
            const token = this.tokenFactory(request.url);
            //console.log(token);
            if(token != null){
                request.header[AuthKey] = `Bearer ${this.tokenFactory(request.url)}`
            }

        }

        //return next(request).then(x=> {  x.data = `your json` ; return x;})
        return next(request);

    }


}
