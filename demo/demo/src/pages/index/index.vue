<template>
	<view class="content">
        <demo-1 :prop1="'哈哈哈'"></demo-1>
        <demo-2></demo-2>
        <demo-3></demo-3>
        <foo-page ref="foo"></foo-page>
	</view>
</template>

<script lang="ts">
import { httpClient } from 'uni-httpclient/dist/httpclient';
	import { Vue,Component, Ref } from "vue-property-decorator";
    import {default as FooPage} from "../../components/Foo.vue";
    import {default as Demo1} from '../../components/demo1.vue';
    import {default as Demo2} from '../../components/demo2.vue';
    import Demo3 from '../../components/demo3.vue';

	@Component({
		components:{ FooPage, Demo1, Demo2, Demo3}
	})
	export default class  IndexPage extends Vue{
		title:string = "hello";
		dt:any = "";
		onLoad() {
			setTimeout(()=> this.foo.setTxt(),1000);
			 
		}
		@Ref("foo")
		foo!:FooPage
		 
	}
</script>

<style>

	
</style>
