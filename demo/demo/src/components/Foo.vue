<template>
    <view>
        <view>Foo Component</view>
        <view>{{txt}}</view>
    </view>
</template>
<script lang="ts">
import { Component,Vue } from 'vue-property-decorator';
@Component
export default class FooPage extends Vue{
    txt:string = "..."
    setTxt(){
        this.txt = "foo page ";
    }
}
</script>
