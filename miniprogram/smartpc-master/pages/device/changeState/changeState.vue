<template>
	<view class="Layout">
		<view class="box common-box">
			<view class="title">请选择：</view>
			<button type="primary" >更换配网方式</button>
			<button type="primary" >断开连接</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

.Layout{
	.box{
		margin-top: 300rpx;
		.title{
			font-size: 35rpx;
			font-weight: 700;
			text-align: center;
			margin-bottom: 30rpx;
		}
		button{
			margin: 30rpx auto;
			border-radius: 15rpx;
			width: 400rpx;
			background-color: rgba(42, 130, 228, 1);
			
		}
	}
	
}
</style>
