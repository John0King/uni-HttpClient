<template>
    <view>{{txt}}
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