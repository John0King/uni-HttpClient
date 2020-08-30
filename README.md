# uni-httpclient

适用于 uniapp 的 HttpClient.

Update: 2020/8/30

- 新增 安全取消
- 新增 实现下载拦截
- 新增 `TimeoutIntercepter` 和 `StatusCodeIntercepter`
- 新增 `TokenStorage` 并且异步的`GetTokenAsync` 支持 OnTokenExpired 钩子函数
- 增强 `JwtTokenIntercepter` 支持异步的 `tokenFactory`
- 新增 抽象接口 `IHttpClientHander` 和 `HttpClient.Send` 允许使用自己编写的 `IHttpClientHander`

核心功能：
- [x] query
  - [x] get
  - [x] post
  - [x] form (post with applicaton/www-urlencoded)
  - [x] delete
  - [x] put
- [x] upload
- [x] download
- [x] 拦截/intercepter
  - [x] query
  - [x] upload
  - [x] download
- [x] CancelToken 取消, 复刻在 .Net 中已经使用十几年的  `CancellationToken`
  - [x] ICancelSource
  - [x] ICancelToken
- 拦截器
  - [x] JwtTokenIntercepter Json Web Token 拦截器
  - [x] AutoDomainIntercepter 自动添加域名的拦截器，用于将 `/api` 转化为 `http://localhost:8080/api`
  - [x] StatusCodeIntercepter 将statuscode 小于200 或 大于等于400 的请求视为错误，抛出 StatusCodeError
  - [x] TimeoutIntercepter 简单的实现 timeout, 该拦截器，注入或者链接一个现有的 `CancelToken` 来实现
  - [x] 数据模拟
  - [x] 自定义拦截器


## 使用方式

```ts
//1. 配置 在 main.ts 中配置
import { HttpClient} from "uni-httpclient"; // 名字具体看你把该库放在哪
const domainIntercepter = new AutoDomainIntercepter((url)=>{
    //url 为请求url, 可以根据url添加自己逻辑， 
    //比如 /api 映射到 api.com,  /v2 映射到 v2.api.com

    return "http://localhost:8080"
})
const jwtTokenIntercepter = new JwtTokenIntercepter((url)=>{
    // 因为拦截器会按顺序执行，所以此处的url已经是完整的url,
    // 在这里可以 url 参数 给不同的域名/路径追加不同的token
    let domain = "*"
    if (url.startWith("http://a.example.com"){
        domain = "a"
    }
    else if ( url.startWith("http://b.example.com")){
        domain = "b";
    }
    // tokenStorage 是一个自己实现的类，用来管理token
    return tokenStorage.getToken(domain);
})
httpClient.intercepters.push(new TimeoutIntercepter( 20 )); // 添加 使用 timeout 参数的必备拦截器， 可以不填，填上则未全局超时， 
//记得在 下载和上传 api上 利用 preventTimeout:true 来阻止该拦截器发生作用，（上传和下载是相对比较耗时的操作）
HttpClient.intercepters.push(domainIntercepter)
HttpClient.intercepters.push(jwtTokenIntercepter)

```

使用
```ts
import { httpClient as http } from "uni-httpclient";
http.get<any>(`/api/user/info`)
.then(r=>{
    // 处理返回的数据
})
```

## 取消 / CancelToken 的使用
除了使用 timeout ， 你可以手动使用 `CancelToken`,
手动使用 `CancelToken` 无需添加 `TimeoutIntercepter`,添加也不受影响， 当同时使用时， 两者都会发生作用。

```typescript
import {CancelToken } from "我们的库地址";
let cancelToken = new CancelToken();
httpClient.Post("/api/do",null,null,null,{ cancelToken: cancelToken })
.then(x=> {      });

// 需要取消的时候

cancelToken.cancel();

```

## 错误

我们的拦截器产生的错误，都是我们自己定义的类型， 可以使用 instanceof 来测试是否是特定的错误 如  
```typescript
httpClient.Get("/api/get")
.cache(e=>{
  if(e instanceof StatusCodeError){
    ....
  }
  else if (e instanceof CancelError){
    ...
  }
})
```

StatusCodeIntercepter 产生的错误是 StatusCodeError, 



## 模拟数据源

模拟数据源要使用自定义的拦截器，且应该将此拦截器放在第一个拦截器（不要让AutoDomainIntercepter发挥作用），
不懂Typescript 的同学可以将一下代码放到 https://www.staging-typescript.org/zh/play 来查看js版本
```typescript
import {
    HttpClientIntercepter,
    IntercepterRequestContext,
    IntercepterResponseContext,
    IntercepterDelegate
} from "@/intercepter";
export class AutoDomainIntercepter implements HttpClientIntercepter {
    constructor() { }

    handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        return new Promose<IntercepterResponseContext>((resove,reject)=>{
          setTimeout(()=>{
            if(request.url == "/api/api1"){
              resove({
                httpClient: null ,
                httpClientHander: null,
                statusCode: 200,
                data: { /*您的数据*/ },
                header: {},
                pipeOptions:request.pipeOptions
              })
            }
            else if(){
              //......
            }
            else{
              reject(new StatusCodeError(400))
            }
            
          }, 2000); // 延时两秒
        });
        // 只要你不调用 next ， 就不会往下执行，你随时可以阻止往下执行
    }
}

```

## 拦截器原理

```
请求 --->  拦截器A   -----> 拦截器B ----> .... ----> IHttpClientHander
                                                  |
                                         处理请求（底层请求方法）
                                                  | 
响应 <----  拦截器A <-----  拦截器B  <----  .... <--- IHttpClientHander

```

Powered by [金昇网络](https://www.kingasc.com)