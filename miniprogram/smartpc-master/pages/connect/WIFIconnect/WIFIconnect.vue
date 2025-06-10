<template>
	<view class="Layout">
		<view class="container common-box">
			<view class="header">
				<text>搜索附近设备</text>
			</view>
			<!-- 搜索设备成功 -->
			<view class="wifi-list" v-if="isShow">
				<view class="showloading" v-if="!wifiList.length">
					<u-loading mode="circle" color="blue" size="100"></u-loading>
					<view>正在搜索附近的设备...</view>
				</view>
				<view class="wifi-block" v-for="(wifi, index) in wifiList" :key="index">
					<view class="wifi-item" @click="connectWIFI(wifi)">
						<text>{{ wifi.SSID }}</text>
						<text>信号：{{ wifi.signalStrength }}</text>
					</view>
				</view>
				<view class="button-group" @click="startWifi" v-if="wifiList.length">重新搜索</view>
				
			</view>

			<!-- 搜索设备失败 -->
			<view class="fail" v-else>
				<view class="top">
					<u-icon name="error-circle" size="120"></u-icon>
					<view>搜索失败，请重试</view>
				</view>
				<view class="bottom">
					<view class="button-group" @click="startWifi">重新搜索</view>
					<view @click="open">搜不到设备？</view>
					<uni-popup ref="popup" type="bottom" :mask-click="false" safe-area background-color="#fff"
						border-radius="10px 10px 0 0">
						<view class="tips">
							<view class="title">搜不到设备怎么办？</view>
							<view>
								1.请确保手机wifi功能已开启，设备已进入配网状态
							</view>
							<view>
								2.搜索时，尽量将手机靠近设备；
							</view>
							<view class="bottom-btn" @click="close">我知道了</view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: true,
				wifiList: [], // 用于存储搜索到的 WiFi 列表
			};
		},
		onLoad() {
			// 页面加载时自动启动 WiFi 搜索
			this.startWifi();
		},
		methods: {
			// 底部弹窗开启和关闭
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			// 开启wifi权限
			startWifi() {
				this.isShow = true; // 展示搜索
				this.wifiList = []; 
				// 检查位置权限
				this.checkLocationPermission().then(() => {
					// 启动 WiFi 搜索
					uni.startWifi({
						success: () => {
							console.log("WiFi 搜索已启动");
							this.getWifiList();
						},
						fail: (err) => {
							console.error("启动 WiFi 搜索失败", err);
							uni.showToast({
								title: "启动 WiFi 搜索失败，请打开WiFi",
								icon: "none",
							});
							this.isShow = false; // 搜索失败，展示失败画面
						},
					});
				}).catch((err) => {
					console.error(err.message);
					uni.showToast({
						title: err.message,
						icon: "none",
					});
					this.isShow = false; // 权限拒绝，展示失败画面
				});
			},
			// 检查位置权限
			async checkLocationPermission() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success: (res) => {
							if (res.authSetting["scope.userLocation"]) {
								resolve(true); // 已授权
							} else {
								uni.showModal({
									title: "授权提示",
									content: "需要开启位置权限才能搜索 WiFi，请授权。",
									showCancel: false,
									success: () => {
										uni.authorize({
											scope: "scope.userLocation",
											success: () => {
												resolve(true); // 用户已授权
											},
											fail: () => {
												reject(new Error(
													"用户拒绝授权位置权限"));
											},
										});
									},
								});
							}
						},
					});
				});
			},
			// 获取wifi列表
			getWifiList() {
				uni.getWifiList({
					success: () => {
						console.log("正在获取 WiFi 列表");
						// 监听 WiFi 列表变化事件
						uni.onGetWifiList((wifiList) => {
							console.log("获取到的 WiFi 列表", wifiList);
							// 筛选包含 "redmi" 的 WiFi（不区分大小写）
							this.wifiList = wifiList.wifiList ? wifiList.wifiList.filter((wifi) =>
								wifi.SSID.includes("SMARTHOST_PROV")) : [];
							console.log('筛选后的wifi列表', this.wifiList);
							// 如果没有搜索到任何设备，展示失败画面
							if (this.wifiList.length === 0) {
								this.isShow = false;
							}

						});
					},
					fail: (err) => {
						console.error("获取 WiFi 列表失败", err);
						this.isShow = false; // 搜索失败，展示失败画面
						uni.showToast({
							title: "获取 WiFi 列表失败",
							icon: "none",
						});
					},
				});
			},
			// 点击设备wifi开始连接
			connectWIFI(wifi) {
				// 提示用户输入 WiFi 密码
				uni.showModal({
					title: `连接到 ${wifi.SSID}`,
					
					placeholderText: "请输入 WiFi 密码",
					showCancel: false,
					editable: true,
					success: (res) => {
						if (res.confirm) {
							const password = res.content;
							uni.connectWifi({
								SSID: wifi.SSID,
								password: password,
								success: () => {
									uni.showToast({
										title: "连接成功",
										icon: "success",
									});
									// 跳转页面
									uni.navigateTo({
										url:'/pages/connect/WIFIconnect/wifiInfo'
									})
								},
								fail: (err) => {
									uni.showToast({
										title: "连接失败：" + err.errMsg,
										icon: "none",
									});
								},
							});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.Layout {
		.container {
			padding: 20px;

			.header {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}

			.wifi-list {
				display: flex;
				flex-direction: column;
				justify-content: center; /* 水平居中 */
				align-items: center; /* 垂直居中 */
				margin-bottom: 20px;

				.showloading {
					font-size: 35rpx;
					text-align: center;

					view {
						margin: 30rpx 0;
					}
				}

				.wifi-block{
					margin-bottom: 60rpx;
					.wifi-item {
						display: flex;
						justify-content: space-between;
						padding: 10px 0;
						border-bottom: 1px solid #ccc;
						width: 600rpx;
					}
				}
				
				.button-group {
					width: 220rpx;
					height: 90rpx;
					background: rgba(42, 130, 228, 1);
					border-radius: 50rpx;
					text-align: center;
					line-height: 90rpx;
					color: #fff;
				}
			}

			.fail {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;

				.top {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 100rpx 0 500rpx;

					view {
						margin: 30rpx 0;
					}
				}

				.bottom {

					.button-group {
						width: 220rpx;
						height: 90rpx;
						background: rgba(42, 130, 228, 1);
						border-radius: 50rpx;
						text-align: center;
						line-height: 90rpx;
						color: #fff;
					}

					view {
						margin: 30rpx 0;
						text-align: center;
						color: rgba(42, 130, 228, 1)
					}

					.tips {
						padding: 0 60rpx 30rpx;
						height: 400rpx;

						view {
							text-align: left;
							color: #000;
						}

						.title {
							text-align: center;
							font-size: 35rpx;
							font-weight: 700;
						}

						.bottom-btn {
							margin-top: 60rpx;
							border-radius: 60rpx;
							border: 2px solid #eee;
							
							height: 100rpx;
							text-align: center;
							line-height: 100rpx;
						}
					}
				}

			}
		}
	}
</style>