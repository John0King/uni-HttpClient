<template>
	<view class="content">
        <image class="logo" src="../../static/logo.png"></image>
		<view>
            <text class="title">{{title}}</text>
			<view>{{dt}}</view>
			<foo-page ref="foo"></foo-page>
        </view>
	</view>
</template>

<script lang="ts">
import { httpClient } from 'uni-httpclient/dist/httpclient';
	import { Vue,Component, Ref } from "vue-property-decorator";
	import {default as FooPage} from "../Foo.vue";

	@Component({
		components:{ FooPage}
	})
	export default class  IndexPage extends Vue{
		title:string = "hello";
		dt:any = "";
		onLoad() {
			this.title += " world";
			 httpClient.get(`/index.html`)
			 .then((x:any)=>{
				 this.dt = x;
			 })
			 .catch(x=>{
				 console.log(`error`);
				 console.log(x)
			 })

			 setTimeout(()=>{
				 this.foo.setTxt();
			 },5000)
			 
		}
		@Ref("foo")
		foo!:FooPage
		 
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
