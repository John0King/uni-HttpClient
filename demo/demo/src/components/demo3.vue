<template>
    <view class="section">
        <view class="h1">Demo3: 手动取消</view>
        <view>
            <button :disabled="cancelToken.isCanceled" @click="cancelclick()" type="primary">取消</button>
        </view>
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
        
        httpClient.get<string>(`/demo3.html`,{},{},{},{
            cancelToken: this.cancelToken,
            preventTimeout:true // 这里我们阻止了默认的超时，自己用的时候可以根据需要不阻止超时，那时候超时和手动触发那个发生更早，哪个管用
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
