<template>
	<view class="common-box">
		<view class="searchBox">
			<view class="searchLoading">
				<uni-icons type="spinner-cycle" size="50"></uni-icons>

			</view>
			<view>正在搜索附近的设备...</view>
		</view>
		<view class="searchList">
			<view class="deviceItem" v-for="item in 4" >
				<uni-icons custom-prefix="iconfont" type="icon-diannaozhuji" size="30"></uni-icons>
				<text class="address">电脑xxx</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"search-box",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.searchBox{
	font-size: 35rpx;
	border-bottom: 1px solid black;
	view{
		margin: 30rpx 0;
		text-align: center;
	}
}
.searchList{
	margin-top: 30rpx;
	font-size: 35rpx;
	.deviceItem{
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		border: 1rpx solid #eee;
		padding: 30rpx;
		box-shadow: 0 0 30rpx rgba(0,0,0,0.1);
		border-radius: 15rpx;
		background-color: #fff;
		width: 100%;
		height: 150rpx;
		.address{
			margin-left: 30rpx;
		}
	}
}
</style>