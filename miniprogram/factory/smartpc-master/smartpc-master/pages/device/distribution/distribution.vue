<template>
	<view class="Layout">
		<view class="common-box">
			<view class="title">请选择配网方式</view>
			<button type="primary" hover-class="none" @click="wifiConnect">WIFI配网</button>
			<button type="primary" hover-class="none" @click="bleConnect">蓝牙遥控器</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			wifiConnect(){
				uni.navigateTo({
					url:'/pages/connect/WIFIconnect/WIFIconnect'
				})
			},
			bleConnect(){
				uni.navigateTo({
					url:'/pages/connect/BLEconnect/BLEconnect'
				})
			}
		}
	}
</script>

<style lang="scss">

.Layout{
	padding-top: 300rpx;
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
</style>
