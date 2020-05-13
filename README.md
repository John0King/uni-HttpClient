# uni-httpclient

使用uniapp 的 HttpClient.

核心功能：
- [x] query
  - [x] get
  - [x] post
  - [x] form (post with applicaton/www-urlencoded)
  - [x] delete
  - [x] put
- [x] upload
- [ ] download
- [x] 拦截/intercepter
  -[x] query
  -[x] upload
  -[ ] download
- 拦截器
  - [x] JwtTokenIntercepter Json Web Token 拦截器
  - [x] AutoDomainIntercepter 自动添加域名的拦截器，用于将 `/api` 转化为 `http://localhost:8080/api`


## 使用方式

```ts
//1. 配置 在 main.ts 中配置
import { HttpClient} from "uni-httpclient";
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
HttpClient.intercepters.push(domainIntercepter)
HttpClient.intercepters.push(jwtTokenIntercepter)

```

使用
```ts
import {HttpClient } from "uni-httpclient";
const http = new HttpClient();
http.get<any>(`/api/user/info`)
.then(r=>{
    // 处理返回的数据
})
```
