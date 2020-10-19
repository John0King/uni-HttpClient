<template>
    <view class="section">
        <view class="h1">Demo3: timeout </view>
        <view class="result">{{result}}</view>
        <view class="result">{{tempPath}}</view>
    </view>
    
</template>
<script lang="ts">
import {Vue,Component} from 'vue-property-decorator'
import {httpClient} from 'uni-httpclient'

@Component
export default class Demo2 extends Vue{
    result:string = '';
    tempPath:string = '';
    mounted(){
        httpClient.get<string>(`/demo2.html`,{},{},{},{ timeout:1 }) // 1秒超时, 全局15秒，这里重写
        .then(x=>this.result = x)
        .catch(x=> this.result = JSON.stringify(x))
    }

    downloadFile(){
        httpClient.download(`/file4.mp4`,{},{},{ preventTimeout:true }) // 不要超时，下载文件需要很长时间
        .then(x=>{
            this.tempPath = x.data
        })
        .catch(x=> this.tempPath = x?.toString())
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
