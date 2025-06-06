<template>
	<view class="Layout">
		<!-- 顶部成功图标和文字 -->
		<view class="success-section">
			<u-icon name="checkmark-circle-fill" size="150" color="rgb(76, 217, 100)"></u-icon>
			<text class="success-text">设备已联网成功</text>
		</view>

		<!-- 输入设备名称 -->
		<view class="input-section">
			<view class="input-label">自定义设备名称</view>
			<input class="device-name-input" type="text" v-model="deviceName" placeholder="请输入设备名称" />
		</view>

		<!-- 保存按钮 -->
		<view class="button-section">
			<button class="save-button" @click="saveDeviceName">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceName: "", // 用户输入的设备名称
			};
		},
		onLoad() {
			this.getDevForm();
		},
		methods: {
			saveDeviceName() {
				if (!this.deviceName.trim()) {
					// 如果用户未输入设备名称，提示用户
					uni.showToast({
						title: "请输入设备名称",
						icon: "none",
					});
					return;
				}

				// 获取用户输入的设备名称
				const savedDeviceName = this.deviceName.trim();
				console.log("保存的设备名称：", savedDeviceName);
				// 可以在这里执行保存逻辑，例如保存到本地存储或发送到服务器
				this.devSave(savedDeviceName);
				
				
				
			},
			// 创建设备
			async devSave(savedDeviceName){
				console.log("save接口")
				try{
					// 调用 save 接口
					const res = await this.$u.api.userDevice.save({
						userCode:this.vuex_user.loginCode,
						name:this.deviceName,
						});
					// 成功回调
					console.log('成功', res);
					uni.showToast({
						title: `设备名称已保存：${savedDeviceName}`,
						icon: "success",
					});
					uni.reLaunch({
						url:'/pages/index/index'
					});
					// console.log(JSON.stringify(this.userDevices[0]))
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
				
			},
			// 创建设备
			async getDevForm(){
				console.log("form接口")
				try{
					// 调用 save 接口
					const res = await this.$u.api.userDevice.form({
						userDeviceId:'1906952395688001536',
						});
					// 成功回调
					console.log('成功', res);
					// console.log(JSON.stringify(this.userDevices[0]))
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
				
			},
		},
	};
</script>

<style lang="scss" scoped>
.Layout{
	.success-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 100rpx;
		.success-text {
			font-size: 40rpx;
			margin-top: 10px;
			font-weight: 700;
		}
	}

	.input-section {
		width: 100%;
		margin-bottom: 30rpx;
		.input-label {
			font-size: 35rpx;
			margin-bottom: 15px;
		}
		.device-name-input {
		
			padding: 20rpx;
			border: 1px solid #ccc;
			border-radius: 15rpx;
			font-size: 35rpx;
		}
	}

	.button-section {
		width: 100%;
		.save-button {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #007aff;
			color: white;
			border-radius: 15rpx;
			font-size: 35rpx;
		}
	}
}
	

	
</style>