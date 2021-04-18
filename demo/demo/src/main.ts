import { httpClient, StatusCodeIntercepter } from 'uni-httpclient'
import Vue from 'vue'
import App from './App.vue'
import { GlobalErrorIntercepter, MyAuthIntercepter } from './intercepter'

Vue.config.productionTip = false
// 我们推荐使用实例， 我们已经移除掉全局拦截器，
// 您可以创建其他的 HttpClient 实例，并添加不同的拦截器
// 这将让您可以对不同的 api 使用不用 HttpClient 成为肯能
httpClient.setupDefaults({
    timeout:15,
    maxTimeout:9,
    retryCount:3,
    retryDelay:1000,
    statusCodeError:true,
    baseUrl:"http://localhost:500/api/"
})
// 在下面配置拦截器， 比如放上 Jwt拦截器
// 或者自己全局拦截所有的错误代码 拦截器
httpClient.intercepters.insertBefore(StatusCodeIntercepter,new MyAuthIntercepter())
httpClient.intercepters.unshift(new GlobalErrorIntercepter())

new App().$mount()
