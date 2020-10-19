<template>
    <view class="section">
         <view>传入：{{prop1}}</view>
        <view class="h1">Demo1: 常规使用</view>
       
        <view class="result">{{result}}</view>
    </view>
    
</template>
<script lang="ts">
import {Vue,Component, Prop} from 'vue-property-decorator'
import {httpClient, StatusCodeError, CancelError} from 'uni-httpclient'

@Component
export default class Demo1 extends Vue{
    result:string = '';
    @Prop({default:'-----'})
    prop1!:string
    mounted(){
        httpClient.get<string>(`/demo1.html`)
        .then(x=>this.result = x)
        .catch(e=> {
            if(e instanceof StatusCodeError){
                this.result = `##返回代码错误：${e.statusCode}`
                // 对于401 等拦截，建议建立自己的拦截器，统一执行
                // 对于500 等错误，也可以建立拦截器， 
            }
            else if(e instanceof CancelError){
                this.result = `##操作取消/超时了`
            }
            else{
                this.result = `## 错误了 ${JSON.stringify(e)}`
            }
        })
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
