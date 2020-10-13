# uni-httpclient

[![npm version](https://badgen.net/npm/v/uni-httpclient)](https://www.npmjs.com/package/uni-httpclient)
[![npm download](https://badgen.net/npm/dt/uni-httpclient)](https://www.npmjs.com/package/uni-httpclient)
[![GitHub version](https://badgen.net/github/forks/john0king/uni-httpclient)](https://github.com/John0King/uni-HttpClient)
[![GitHub star](https://badgen.net/github/stars/john0king/uni-httpclient)](https://github.com/John0King/uni-HttpClient)

适用于 uniapp 的 HttpClient. 如果这个库帮助了您，请您在github上给个star, 或者dcloud 插件市场上点个赞。

## Update: 2020/10/14

- 新增 `retryDelay` 选项，重试间隔（`RetryIntercepter`）
- 新增 `Task`, `TaskSource` 类，解决Promise的设计缺陷
- 修复 `CancelToken` 的设计问题


## 核心功能：
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
  - [x] RetryIntercepter 简单的实现 timeout, 该拦截器，注入或者链接一个现有的 `CancelToken` 来实现
  - [x] 数据模拟
  - [x] 自定义拦截器


## 使用方式

### 一、安装
1. 通过 npm/yarn 安装

```bash
$> npm install uni-httpclient
```
2. 或者通过Hbuild 导入或者从插件市场下载手动安装

### 二、配置

```ts
//===========新功能===========
// 注意类型 HttpClient 和 实例 httpClient 
import { HttpClient} from "uni-httpclient"; // 名字具体看你把该库放在哪

// setupDefaults 是 HttpClient 这个类的静态函数
// 你必须配置以下内容才能将所有的拦截器都打开，如果不配置 其中某个比如 retryCount, 则重试拦截器将不会添加
HttpClient.setupDefaults({
    timeout:15,
    retryCount:1, // 建议重试1次就好
    retryDelay:1000, //1秒，默认值
    statusCodeError:true,
    baseUrl:"http://localhost:500/api/"
})

//=======自定义方式=============

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

### 三、使用
```ts
import { httpClient } from "uni-httpclient";
// 如果不喜欢 httpClient 这个词, 可以用 as 重命名
// import { httpClient as http} from "uni-httpclient";
httpClient.get<any>(`/api/user/info`)
.then(r=>{
    // 处理返回的数据
})
```

## 取消 / CancelToken 的使用
除了使用 timeout ， 你可以手动使用 `CancelToken`,
手动使用 `CancelToken` 无需添加 `TimeoutIntercepter`,添加上也不受影响， 当同时使用时， 两者都会发生作用（但只会发生一次）。

```typescript
import {CancelToken } from "我们的库地址";
let cancelToken = new CancelToken();
httpClient.Post("/api/do",null,null,null,{ cancelToken: cancelToken })
.then(x=> {      });

// 需要取消的时候

cancelToken.cancel();

```

### 详细解释 `CancelToken` (需要了解部分typescript 知识)

`CanelToken` 实现了 `ICancelSource` 和 `ICancelToken`（这两个接口在 js中是不存在的，要了解这个必须了解 typescript interface 是什么,简单的说就是单纯的token 不能调用取消，只有 source 可以调用取消）， 之所以说这个，是希望大家更具体的知道如何替换`CancelToken`,
比如有一个 `CancelToken` 叫做 `a`是传入的 , 还有一个 `b` 我们自己创建的, 当他们在一起时该怎么处理，首先我们**不应该直接操作`a`**, 因为`a`有自己的事件，而且可能传给了多个function, 正确的做法是 当 `a` 取消时，我们的`b`也取消，如果`a` 没有取消，我们就操作我们的取消
```typescript
// 入口
function main(){
    let cancel = new CancelToken();
    cancel.CancelAfter(10 * 1000);//10 秒
    cancel.register(x=> console.log(`token a cancel 了`))
    doLongStuff(cancel)
    .then(()=>console.log(`没有取消`))
    .cache(e=> console.log(`最终还是取消了`))
}

function doLongStuff(cancelToken:ICancelToken):Promise<void>{
    // 我们里面要求 5秒就取消
    let runningTime = (Math.random() * 20); //随机0-20秒
    let cancel = new Cancel();
    setTimeout(()=> cancel.cancel(), 5000);
    cancel.linkeToken(cancelToken);
    //这里里面的 cancel 跟外面的没有关系， 里面的取消，并不会导致外面的 取消,但外面的 token取消，会触发里面的取消


    return new Promise<void>((resolve,reject)=>{
        setTimeout(()=>{
            // 检查自己的token,不要管别的
            if(cancel.isCanceled){ 
                reject(`canceled`)
            }
            else{
                resove();
            }
        }, runningTime * 1000)
        
    })
}
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
Cancel 产生的错误是 CancelError


## 模拟数据源

模拟数据源要使用自定义的拦截器，且应该将此拦截器放在第一个拦截器（不要让AutoDomainIntercepter发挥作用），
不懂Typescript 的同学可以将一下代码放到 https://www.staging-typescript.org/zh/play 来查看js版本
```typescript
import {
    HttpClientIntercepter,
    IntercepterRequestContext,
    IntercepterResponseContext,
    IntercepterDelegate,
    TaskSource,
    Task
} from "uni-httpclient";
export class MyDataIntercepter implements HttpClientIntercepter {
    constructor() { }

    async handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        await Task.delay(2000); // 延时2秒
        
        if(request.url == "/api/api1"){
            return {
                httpClient: null ,
                httpClientHander: null,
                statusCode: 200,
                data: { /*您的数据*/ },
                header: {},
                pipeOptions:request.pipeOptions
            }
        }
        // 只要你不调用 next ， 就不会往下执行，你随时可以阻止往下执行
    }
}

// 使用

HttpClient.setupDefaults({ 
  retryCount: 1,
  timeout:15,
  statusCodeError:true,
  baseUrl:"https://localhost:5001"
 });
 HttpClient.intercepters.unshift(new MyDataIntercepter()) // 使用unshif 将此拦截器放在最开始的时候

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
如果这个库帮助到了您， 请再 github https://github.com/john0king/uni-httpclient 给个star
