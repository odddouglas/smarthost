<template>
    <view class="Layout">
		<view class="tishi">蓝牙遥控器无需配置网络即可操控设备，注意不能与设备距离过远，远程控制功能请选择wifi配网</view>
		<view class="container common-box" v-if="isConnect">
			<view class="header">
				<text>搜索附近设备</text>
			</view>
			<!-- 搜索设备成功 -->
			<view class="ble-list" v-if="isShow">
				<view class="showloading" v-if="!bleDevList.length"> 
					<u-loading mode="circle" color="blue" size="100"></u-loading>
					<view>正在搜索附近的设备...</view>
				</view>
				
				<view class="ble-block" v-for="(dev, index) in bleDevList" :key="index">
					<view class="ble-item" @click="bleConnect(dev)">
						<view class="item-list">设备地址:  {{ dev.deviceId }}</view>
						<view class="item-list">设备名称:  {{ dev.name }}</view>
						<view class="item-list">信号:{{ dev.RSSI }}</view>
					</view>
				</view>
				<view class="button-group" @click="restartBle" v-if="bleDevList.length">重新搜索</view>
				
			</view>
			
			<!-- 搜索设备失败 -->
			<view class="fail" v-else>
				<view class="top">
					<u-icon name="error-circle" size="120"></u-icon>
					<view>搜索失败，请重试</view>
				</view>
				<view class="bottom">
					<view class="button-group" @click="startBle">重新搜索</view>
					<view @click="open">搜不到设备？</view>
					<uni-popup ref="popup" type="bottom" :mask-click="false" safe-area background-color="#fff"
						border-radius="10px 10px 0 0">
						<view class="tips">
							<view class="title">搜不到设备怎么办？</view>
							<view>
								1.请确保手机蓝牙功能已开启，设备已进入配网状态
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
		
		<view class="successConnect" v-else>
			
			<view class="success-section">
				<u-icon name="checkmark-circle-fill" size="150" color="rgb(76, 217, 100)"></u-icon>
				<text class="success-text">设备蓝牙连接成功</text>
			</view>
		
			
			<view class="input-section">
				<view class="input-label">自定义设备名称</view>
				<input class="device-name-input" type="text" v-model="deviceName" placeholder="请输入设备名称" />
			</view>
		
			
			<view class="button-section">
				<button class="save-button" @click="devSave">保存</button>
			</view>
		</view>
    </view>
</template>
<script>
	import bluetooth from '../../../common/ble.js';
	// import mqttClient from '../../../common/mqtt.js';
    export default {
        components: {
        },
        data() {
            return {
				deviceName:"",
				isConnect:true,
				isShow: true,
                newsList: [],
                tabIndex: 0,	// 顶部标签栏索引
                tabBars: [{
                    name: '设备列表',
                    id: 'shebeiliebiao'
                }, {
                    name: '活动连接',
                    id: 'tiaoshiyemian'
                }],
				bleDevList: [],		// 蓝牙设备列表
				curDevice: {bleStatus: 0,name: '', rssi: '', deviceId: '', serviceId: '', characteristicId: '', writecharId:''},	// 当前连接设备的信息
                scrollInto: "",
            }
        },
        onLoad() {
			console.log("onload.......x......")
			this.startBle();
			
        },
		
		// onPullDownRefresh() {
		// 	console.log('onPullDownRefresh');
		// 	this.bleDevList = [];
		// 	bluetooth.getBluetoothState().then(()=>{
		// 			bluetooth.startDiscoveryBluetooth().then(()=>{
		// 				uni.stopPullDownRefresh();
		// 			})
		// 		}
		// 	)

		// },
        methods: {
			// 底部弹窗开启和关闭
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			// 重新搜索
			async restartBle(){
				uni.closeBluetoothAdapter({
					success(res) {
						console.log(res);
					}
				});
				this.startBle();
				// this.bleDevList = [];
				// try {
				// 	// 调用 getBluetoothDevices 方法获取有名称的设备列表
				// 	const devices = await bluetooth.getBluetoothDevices();
				// 	console.log('获取到的有名称的设备列表', devices);
				// 	this.bleDevList = devices; // 将设备列表存储到 data 中
				// } catch (err) {
				// 	console.error('获取蓝牙设备列表失败', err);
				// 	// 请开启蓝牙
				// 	uni.showToast({
				// 		title: '请打开蓝牙',
				// 		icon: 'none'
				// 	});
				// }
			},
			// 搜索蓝牙
			startBle(){
				this.isShow = true;
				this.bleDevList = [];		// 蓝牙设备列表先置为空
				bluetooth.getBluetoothState().then(()=>{
						// 开始搜索蓝牙设备
						bluetooth.startDiscoveryBluetooth().then(()=>{
							bluetooth.onBluetoothDeviceFound(this.onDevDiscovery);
						})
					}
				).catch((error) =>{
					this.isShow = false;
				})
				
			},
			// 蓝牙连接
			bleConnect(bleDev){
				uni.showToast({
					title:"连接中",
					icon:"loading"
				});
				bluetooth.connectBluetooth(bleDev.deviceId).then((deviceId)=>{
					this.curDevice.name = bleDev.name;
					this.curDevice.deviceId = deviceId;
					this.curDevice.rssi = bleDev.rssi;
					this.curDevice.bleStatus = 1;
					console.log(deviceId)
					bluetooth.getServiceId(this.curDevice.deviceId).then((serviceId)=>{
						this.curDevice.serviceId = serviceId;
						console.log(this.curDevice.deviceId, this.curDevice.serviceId)
						bluetooth.getCharacteId(this.curDevice.deviceId, this.curDevice.serviceId).then((characteristics)=>{
							console.log(characteristics);
							let characteristicId = ''
							characteristics.forEach(item => {
								// 003
								if (item.properties.notify === true && item.properties.read === true) {
									// 监听
									characteristicId = item.uuid;
								}
								
								// 检查是否支持 write 属性
								// if (item.properties.write === true) {
								// 	this.curDevice.writecharId = item.uuid;
								// 	console.log("找到支持 write 的特征值:", item.uuid);
								// }
								
							});
							this.curDevice.characteristicId = characteristicId;
							let index = this.bleDevList.indexOf(bleDev); // 找到要删除的元素的索引
							if (index !== -1) {  
							    this.bleDevList.splice(index, 1); // 删除该元素  
							}
							bluetooth.stopDiscoveryBluetooth();
							this.tabIndex = 1;
							
							console.log(this.curDevice.characteristicId)
							if(characteristicId){
								console.log("代码运行到这里了")
								bluetooth.startNotice(this.curDevice.deviceId, this.curDevice.serviceId, this.curDevice.characteristicId, this.onBLECharacteristicValueChange);
							}
						});
						uni.hideToast();
						// 蓝牙连接成功后，判断用户是要wifi联网还是蓝牙联网
						uni.showModal({
							title: '蓝牙连接成功',
							showCancel: false,
							// content: '是否需要WIFI控制',
							success: (res) =>{
								this.isConnect = false;
								// if (res.confirm) {
								// 	uni.navigateTo({
								// 		url:'/pages/connect/WIFIconnect/wifiInfo',
								// 		events: {
								// 			// 通过事件发送数据
								// 			someEvent: (data) => {
								// 				console.log(data); // 这里可以处理返回的数据
								// 			},
								// 		},
								// 		success: (res) => {
								// 		    // 通过 eventChannel 发送数据
								// 		    res.eventChannel.emit('sendData', { data: this.curDevice });
								// 		}
								// 	});
								// } else if (res.cancel) {
								// 	console.log('用户点击取消');
								// 	this.isConnect = false;
								// }
							}
						});
					})
				})
				
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
					this.$u.vuex('vuex_bleDev', {
						userCode:this.vuex_user.loginCode,
						name:savedDeviceName,
						// name:this.curDevice.name,
						bleStatus:1,
						bleDeviceid:this.curDevice.deviceId,
						bleRssi:this.curDevice.rssi,
						bleServices:this.curDevice.serviceId,
						bleCharacteristicId: this.curDevice.characteristicId,
					});
					// 成功回调
					console.log('成功');
					uni.reLaunch({
						url:'/pages/index/index'
					});
				}catch(err){
					// 错误回调
					console.error('失败');
				};
				console.log("调用结束");
				
			},
			disconnectBle(){
				bluetooth.disconnectBluetooth(this.curDevice.deviceId).then(()=>{
					this.curDevice = {};
					this.tabIndex = 0;
					console.log(this.tabIndex)
					bluetooth.startDiscoveryBluetooth();
				})
			},
			// 监听蓝牙特征值变化
			// 将 ArrayBuffer 转换为十六进制字符串
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					bit => ('00' + bit.toString(16)).slice(-2)
				);
				return hexArr.join(' ');
			},
			// 转换为二进制
			hexToBinary(hex) {
			    let binary = '';
			    for (let i = 0; i < hex.length; i += 2) {
			        let byte = parseInt(hex.substr(i, 2), 16);
			        let bits = byte.toString(2).padStart(8, '0');
			        binary += bits + ' ';
			    }
			    return binary.trim();
			},
			onBLECharacteristicValueChange(characteristic){
				if (characteristic.value) {
					
					console.log("收到原始的数据", characteristic, characteristic.value);
					const receivedData = this.ab2hex(characteristic.value); // 转换为字符串
					console.log("接收到的数据", receivedData);
					// 按空格分割字符串，得到数组
					const hexArray = receivedData.split(' ');
					console.log(hexArray)
					// 提取主机状态部分
					const extractedHex = hexArray[4] + ' ' + hexArray[5];
					console.log(extractedHex)
					// 转换为十六进制07c5
					const reversedHex = extractedHex.split(' ').reverse().join('');
					console.log(reversedHex)
					const result = this.hexToBinary(reversedHex);
					console.log("主机状态",result);
					
					// parseReceivedData(page, receivedData);
					// console.log("监听低功耗蓝牙设备的特征值变化", JSON.stringify(result));
					// let restr = bluetooth.ab2str(result.value);
					// console.log(restr);
					
					// let msg = '0xa5 0xfa 0x00 0x81 0xc5 0x07 0xec 0xfb';
					// let buffer = bluetooth.hex2ab(msg)
					// // let buffer = bluetooth.str2ab(msg);
					// bluetooth.writeData(this.curDevice.deviceId, this.curDevice.serviceId, this.curDevice.writecharId, buffer);
				}
				
				
			},
			// 蓝牙设备列表处理
            onDevDiscovery(devList) {
				devList.forEach((item) => {  
				    if (item.name.length > 0) {
					
				        let isHave = this.bleDevList.some((dev, idx) => {  
				            if (dev.name === item.name) {  
				                // 更新已存在的项（如果需要的话）  
				                this.bleDevList[idx] = item;  
				                return true; // 找到了就退出 some 的循环  
				            }  
				            return false;  
				        });  
				          
				        if (!isHave) {  
				            // 如果没有找到，就添加到 bleDevList 中  
				            this.bleDevList.push(item);  
				        }  
				    }  
				});  
            },
            ontabtap(e) {
                let index = e.target.dataset.current || e.currentTarget.dataset.current;
				console.log(index)
				this.tabIndex = index;
            },
        }
    }
</script>

<style lang="scss" scoped>


.Layout {
	.tishi{
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 15rpx;
		line-height: 50rpx;
		background-color: #eee;
		font-size: 30rpx;
		color: #777;
	}
	
	.container {
		padding: 20px;

		.header {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 20px;
		}

		.ble-list {
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

			.ble-block{
				margin-bottom: 20rpx;
				.ble-item {
					display: block;
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
