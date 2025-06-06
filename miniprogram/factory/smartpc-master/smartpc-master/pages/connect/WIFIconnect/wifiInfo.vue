<template>
	<view class="Layout">
		<view class="common-box" v-if="!isConnect">
			<view class="header">
				<text>连接到 Wi-Fi</text>
			</view>
			<view class="form-container">
				<!-- Wi-Fi 名称输入框 -->
				<view class="form-item">
					<view>Wi-Fi 名称：</view>
					<view class="input-box">
						<input type="text" :placeholder="selectedWifi.SSID || '请输入WiFi'" >
						<picker mode="selector" :range="wifiList" range-key="SSID" @change="onWifiSelect">
							<!-- <view class="wifi-picker">
								{{ selectedWifi.SSID || '选择WiFi' }}
							</view> -->
							<uni-icons type="down" size="24" color="#999"></uni-icons>

							
						</picker>
					</view>
					
				</view>
			
				<!-- Wi-Fi 密码输入框 -->
				<view class="form-item">
					<view>Wi-Fi 密码：</view>
					<view class="input-box">
						<input :password="isPassword" v-model="wifiPassword" placeholder="请输入 Wi-Fi 密码"  />
						<uni-icons
						      class="eye"
						      :type="isPassword ? 'eye-slash' : 'eye'"
						      size="24"
						      color="#999"
						      @click="togglePasswordVisibility"
						    />
					</view>
					
				</view>
			
				<!-- 下一步按钮 -->
				<button class="next-button" @click="nextStep">下一步</button>
			</view>
		</view>
		
		<view class="successConnect" v-else>
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
				<button class="save-button" @click="devSave">保存</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	// const $root = require('../../../common/sec0.js');
	
	import * as sec0 from '../../../common/sec0.js';
	import * as wificonfig from '../../../common/wifi_config.js';
	
	export default {
		data() {
			return {
				isConnect:false,
				isPassword: true, // 是否显示密码
				wifiList: [], // 存储扫描到的 Wi-Fi 列表
				selectedWifi: {}, // 当前选中的 Wi-Fi
				wifiPassword: "", // 用户输入的 Wi-Fi 密码
				deviceName: "", // 用户输入的设备名称
				wifiInfo:{},	// 要保存的wifi信息
				bleDev:{},		// 蓝牙信息
			};
		},
		onLoad() {
			// 获取页面实例
			const eventChannel = this.getOpenerEventChannel();
			// 监听事件，接收数据
			eventChannel.on('sendData', (data) => {
			  console.log('接收到的数据', data.data); // data.data 是传递的对象
			  this.bleDev = data.data; // 将接收到的数据存储到 data 中
			  console.log(JSON.stringify(this.bleDev))
			});
			// 页面加载时自动扫描 Wi-Fi
			this.scanWifi();
		},
		methods: {
			// 是否显示密码
			togglePasswordVisibility() {
			  this.isPassword = !this.isPassword;
			},
			// 扫描附近的 Wi-Fi
			scanWifi() {
				uni.startWifi({
					success: () => {
						uni.getWifiList({
							success: () => {
								uni.onGetWifiList((wifiList) => {
									this.wifiList = wifiList.wifiList || [];
									console.log("扫描到的 Wi-Fi 列表：", this.wifiList);
								});
							},
							fail: (err) => {
								console.error("获取 Wi-Fi 列表失败", err);
								uni.showToast({
									title: "获取 Wi-Fi 列表失败",
									icon: "none",
								});
							},
						});
					},
					fail: (err) => {
						console.error("启动 Wi-Fi 搜索失败", err);
						uni.showToast({
							title: "启动 Wi-Fi 搜索失败",
							icon: "none",
						});
					},
				});
			},
			// 处理 Wi-Fi 选择
			onWifiSelect(e) {
				const index = e.detail.value;
				this.selectedWifi = this.wifiList[index];
			},
			// 下一步按钮点击事件
			nextStep() {
				if (!this.selectedWifi.SSID) {
					uni.showToast({
						title: "请选择 Wi-Fi 网络",
						icon: "none",
					});
					return;
				}
				if (!this.wifiPassword) {
					uni.showToast({
						title: "请输入 Wi-Fi 密码",
						icon: "none",
					});
					return;
				}

				// 获取到的 Wi-Fi 信息
				this.wifiInfo = {
					SSID: this.selectedWifi.SSID,
					password: this.wifiPassword,
				};

				// console.log("获取到的 Wi-Fi 信息：", wifiInfo);

				/*  可以在这里调用连接 Wi-Fi 的逻辑
					将获取到的wifi信息发送给设备
					 等待设备进行联网，接受设备联网成功的信息
					 然后跳转到联网成功页面*/
				// 设备连上wifi
				// this.connectToWifi(this.wifiInfo);
				// 从 proto-ver 端点获取设备版本信息
				uni.request({
					url: 'http://192.168.4.1/proto-ver',
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded' //请求头
					},
					data: '{}', // 发送空字符串，确保 Content-Length: 0
					success: (res) => {
						console.log('请求成功：', res);
						const uint8arr = new Uint8Array(res); 
						console.log(wificonfig.WiFiConfigPayload.decode(uint8arr));
					},
					fail: (err)=> {
						console.error('请求失败：', err);
					}
				});
		
				
				// 创建会话
				// 创建消息对象
				const message = sec0.Sec0Payload.create({
				  msg: sec0.Sec0MsgType.S0_Session_Command, // 假设 0 是有效的枚举值
				  sc: {}  // 假设 sc 是一个嵌套消息，符合 S0SessionCmd 的定义
				});
				// 序列化为 Uint8Array
				// const buffer = S0SessionCmd.encode(message).finish();
				const buffer = sec0.Sec0Payload.encode(message).finish();
				// Log the serialized buffer
				console.log(buffer);
				const newbuffer = Uint8Array.from(buffer).buffer;
				console.log(newbuffer);
				// 使用 wx.request 或 wx.connectSocket 发送 buffer
				uni.request({
					url: 'http://192.168.4.1/prov-session', // 替换为设备的实际IP地址和端点
					method: 'POST',
					header: {
						'content-type': 'application/octet-stream' // Protobuf消息的MIME类型
					},
					data: newbuffer, // 发送编码后的Protobuf消息
					success: (res) => {
						console.log('会话成功',res);
						const uint8arr = new Uint8Array(res); 
						console.log(wificonfig.WiFiConfigPayload.decode(uint8arr));
					},
					fail: (err) => {
						console.log('会话失败',err)
					}
				});
				
				// this.wifiInfo.SSID = this.stringToUTF8Array(this.wifiInfo.SSID)
				// this.wifiInfo.password = this.stringToUTF8Array(this.wifiInfo.password)
				// console.log('WiFi名',this.wifiInfo.SSID)
				// console.log('密码',this.wifiInfo.password)
				
				
				// 创建 WiFi 配置消息对象
				const wifimessage =  wificonfig.WiFiConfigPayload.create({
					msg: wificonfig.WiFiConfigMsgType.TypeCmdSetConfig, // 设置 WiFi 配置的枚举值
					cmdSetConfig: {
						ssid: this.stringToUTF8Array(this.wifiInfo.SSID), // "Hello Wi-2-2" 的 UTF-8 编码
						passphrase: this.stringToUTF8Array(this.wifiInfo.password), // "Password!" 的 UTF-8 编码	
					}
					
				});
				
				// // 序列化为 Uint8Array
				const wifibuffer =  wificonfig.WiFiConfigPayload.encode(wifimessage).finish();
				
				// Log the serialized buffer
				console.log('wifi信息',wifibuffer);
				const newwifibuffer = Uint8Array.from(wifibuffer).buffer;
				console.log(newwifibuffer);
				
				// 使用 uni.request 发送 buffer
				uni.request({
					url: 'http://192.168.4.1/prov-config', // 替换为设备的实际IP地址和端点
					method: 'POST',
					header: {
						'content-type': 'application/octet-stream' // Protobuf 消息的 MIME 类型
					},
					data: newwifibuffer, // 发送编码后的 Protobuf 消息
					success: (res) => {
						console.log('WiFi 配置成功', res);
						const uint8arr = new Uint8Array(res); 
						console.log(wificonfig.WiFiConfigPayload.decode(uint8arr));
					},
					fail: (err) => {
						console.log('WiFi 配置失败', err);
					}
				});
				
				// 发送 ApplyConfig
				const applyConfigMessage = wificonfig.WiFiConfigPayload.create({
				  msg: wificonfig.WiFiConfigMsgType.TypeCmdApplyConfig,
				  cmdApplyConfig: {} // 空对象即可
				});
				
				const applyBuffer = wificonfig.WiFiConfigPayload.encode(applyConfigMessage).finish();
				const applyArrayBuffer = Uint8Array.from(applyBuffer).buffer;
				
				uni.request({
				  url: 'http://192.168.4.1/prov-config',
				  method: 'POST',
				  header: {
				    'content-type': 'application/octet-stream',
				  },
				  data: applyArrayBuffer,
				  success: (res) => {
				    console.log('ApplyConfig 成功',res);
					const uint8arr = new Uint8Array(res); 
					console.log(wificonfig.WiFiConfigPayload.decode(uint8arr));
				    uni.showToast({
				      title: '配网完成',
				      icon: 'success',
				    });
				  },
				  fail: (err) => {
				    console.error('ApplyConfig 失败', err);
				    uni.showToast({
				      title: '发送 ApplyConfig 失败',
				      icon: 'none',
				    });
				  }
				});

				
			},
			// 辅助函数：将字符串转换为 UTF-8 编码的字节数组
			stringToUTF8Array(str) {
			    // 创建一个空的字节数组
			    const utf8Array = [];
			
			    // 遍历字符串中的每个字符
			    for (let i = 0; i < str.length; i++) {
			        let charCode = str.charCodeAt(i);
			
			        // 处理单字节字符（ASCII）
			        if (charCode <= 0x7F) {
			            utf8Array.push(charCode);
			        }
			        // 处理双字节字符
			        else if (charCode <= 0x7FF) {
			            utf8Array.push(0xC0 | (charCode >> 6));
			            utf8Array.push(0x80 | (charCode & 0x3F));
			        }
			        // 处理三字节字符
			        else if (charCode <= 0xFFFF) {
			            utf8Array.push(0xE0 | (charCode >> 12));
			            utf8Array.push(0x80 | ((charCode >> 6) & 0x3F));
			            utf8Array.push(0x80 | (charCode & 0x3F));
			        }
			        // 处理四字节字符（UTF-16）
			        else {
			            charCode -= 0x10000;
			            utf8Array.push(0xF0 | (charCode >> 18));
			            utf8Array.push(0x80 | ((charCode >> 12) & 0x3F));
			            utf8Array.push(0x80 | ((charCode >> 6) & 0x3F));
			            utf8Array.push(0x80 | (charCode & 0x3F));
			        }
			    }
			
			    // 将数组转换为 Uint8Array
			    return new Uint8Array(utf8Array);
			},
			
			// 连接到 Wi-Fi
			connectToWifi(wifiInfo) {
				uni.connectWifi({
					SSID: wifiInfo.SSID,
					password: wifiInfo.password,
					success: () => {
						uni.showToast({
							title: "连接成功",
							icon: "success",
						});
						this.isConnect = true;
					},
					fail: (err) => {
						uni.showToast({
							title: "连接失败：" + err.errMsg,
							icon: "none",
						});
					},
				});
			},
			// 创建设备
			async devSave(){
				console.log("save接口")
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
				try{
					// 调用 save 接口
					const res = await this.$u.api.userDevice.save({
						userCode:this.vuex_user.loginCode,
						name:savedDeviceName,
						wifiStatusTo: 1,
						wifiSsidTo: this.wifiInfo.SSID,
						wifiPasswordTo: this.wifiInfo.password,
						// bleStatus:this.bleDev.bleStatus,
						// bleDeviceid:this.bleDev.deviceId,
						// bleRssi:this.bleDev.rssi,
						// bleServices:this.bleDev.serviceId,
						});
					// 成功回调
					console.log('成功', res);
					uni.reLaunch({
						url:'/pages/index/index'
					});
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
	.header {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
	}
	.form-container{
		.form-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15px;
			.input-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex: 1;
				border: 1px solid #ccc;
				padding: 10px;
				border-radius: 5px;		
			}
		}
		
		.next-button {
			width: 100%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			background-color: #007aff;
			color: white;
			border-radius: 5px;
		}
	}
	
	.successConnect{
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
}

</style>
