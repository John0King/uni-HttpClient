import { CancelError, HttpClientIntercepter, IntercepterDelegate, IntercepterRequestContext, IntercepterResponseContext, StatusCodeError } from "uni-httpclient";

export class MyAuthIntercepter implements HttpClientIntercepter{
    async handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        // 演示如何自定义拦截器
        var rnd = Math.random() * 10;
        request.header['abc'] = '123';
        // 这里演示如何利用pipeOption 跟拦截器通信
        if(request.pipeOptions.useMyAuth == true &&  rnd > 5){
            // 只有当配置了 useMyAuth：true 的时候， 我们才根据我们的规则进行
            // 如果 rnd 比5大， 则我们当不会发送请求， 而是返回我们的返回值；
            return {
                statusCode:200,
                data: { rnd: rnd  }, // 因为是 200, 所以data会返回
                httpClient: undefined,
                httpClientHander:undefined,
                header:{},
                pipeOptions:request.pipeOptions
            }

            // 如果您不想返回任何信息，可以 直接 throw 一个Error
            // 比如；
            //throw new StatusCodeError(401);
        }

        // 此行之前都是 前拦截
        const result =  await next(request); // 这里是关键， 如果您想让它继续执行，您必须调用 next() 
        // 此行以后都是 后拦截
        result.data = { ...result.data, abc:rnd }; // 这个例子是给 data 增加一个 abc属性

        // 返回我们的响应
        return result;
    }

}

// 这个代码您可以直接拿去修改一下，直接用
export class GlobalErrorIntercepter implements HttpClientIntercepter{
    async handle(request: IntercepterRequestContext, next: IntercepterDelegate): Promise<IntercepterResponseContext> {
        try{
            return await next(request);
        }
        catch(e){
            if(e instanceof CancelError){
                uni.showToast({
                    title: '您的请求取消了',
                    icon: 'none'
                })
            }
            else if(e instanceof StatusCodeError){
                if(e.statusCode == 401){
                    // 这里应该去登录
                    // uni.reLaunch({ url: '/pages/login'  })
                    //我们这里模拟一下就好了
                    uni.showModal({
                        content: '您应该去登录了',
                        showCancel: false
                    })
                }
                else if( e.statusCode == 403){
                    uni.showModal({
                        content: '您没有权限啊',
                        showCancel: false
                    })
                }

                else{
                    uni.showModal({
                        content: 'http状态码错误:' + e.statusCode,
                        showCancel: false
                    })
                }
            }
            else{
                uni.showToast({
                    title: '未知的错误呢',
                    icon: 'none'
                })
            }

            throw e; // 确保错误被抛出
        }
    }

}