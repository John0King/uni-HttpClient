import { HttpClientIntercepter } from "./intercepter";

export class IntercepterCollection extends Array<HttpClientIntercepter>{
    insertBefore<T extends HttpClientIntercepter>(type:Type<T>, value:HttpClientIntercepter):void{
        let index = this.findIndex(x=> x instanceof type);
        if(index > 0){
            this.splice(index,0,value);
        }
        else{
            this.unshift(value);
        }
        
    }

    insertAfter<T extends HttpClientIntercepter>(type:Type<T>, value:HttpClientIntercepter):void{
        let index = this.findIndex(x=> x instanceof type);
        if(index >= 0){
            index = index + 1;
            this.splice(index,0,value);
        }
        else{
            this.push(value);
        }
    }
}

interface Type<T=any>{
    new (...args:any[]):T
}