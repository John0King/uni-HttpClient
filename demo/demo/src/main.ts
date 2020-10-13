import { HttpClient } from 'uni-httpclient'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

HttpClient.setupDefaults({
    timeout:15,
    retryCount:3,
    retryDelay:1000,
    statusCodeError:true,
    baseUrl:"http://localhost:500/api/"
})
new App().$mount()
