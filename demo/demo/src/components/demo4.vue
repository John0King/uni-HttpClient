<template>
    <view class="section">
        <view class="h1">Demo4: 拦截器 （多刷新几次看看）</view>
        <view class="result">{{result}}</view>
    </view>
    
</template>
<script lang="ts">
import {Vue,Component} from 'vue-property-decorator'
import {httpClient,CancelError, CancelToken, StatusCodeError } from 'uni-httpclient'

@Component
export default class Demo1 extends Vue{
    result:string = '';
    cancelToken :CancelToken = new CancelToken();
    mounted(){
        
        httpClient.get<string>({
            url:'/demo4.html',
            pipeOptions:{
                useMyAuth:true,// 根据拦截的约定，这样将启用拦截器,
                preventRetry:true // 不要重试了
            }
        })
        .then(x=>this.result = x)
        .catch(e=> {
            if(e instanceof StatusCodeError){
                this.result = `##返回代码错误：${e.statusCode}`
            }
            else if(e instanceof CancelError){
                this.result = `##操作取消/超时了`
            }
            else{
                this.result = `## ${JSON.stringify(e)}`
            }
        })
    }

    cancelclick(){
        this.cancelToken.cancel();
    }
}
</script>

<style scoped>
.h1{
    border-left: 2px solid lightskyblue;
    font-size: 55rpx;
}
.result{
    padding: 1em;
    height: 200rpx;
    overflow: auto;
    background-color: lightslategray;
}
</style>
