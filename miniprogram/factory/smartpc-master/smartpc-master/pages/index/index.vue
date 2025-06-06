<template>
	<view class="Layout">
		<view class="pic">
			<image src="/static/common/img/indexpic.png" mode="scaleToFill"></image>
		</view>
		
		<!-- 设备列表 -->
		<view class="deviceList">
			<text>联网设备</text>
			<!-- 添加设备 -->
			<view class="addDevice common-box">
				<!-- <text>添加设备</text> -->
				<view class="addBtn" @click="toWifiConnect">
					+ 去添加
				</view>			
			</view>
			<view class="currentPC">
				<view class="deviceItem" @click="gotoWifiControl(item.userDeviceId,item.wifiStatusTo)" v-for="item in userDevices" :key="item.id">
					<uni-icons custom-prefix="iconfont" type="icon-diannaozhuji" size="30"></uni-icons>
					<view class="text">
						<view>{{item.name}}</view>
						<view class="deviceState">
							状态：{{item.pcStatus ? '已开机' : '已关机'}}
						</view>
					</view>
					<view>
						<uni-icons custom-prefix="iconfont" type="icon-wifi" size="20" :color="item.wifiStatusTo ? 'rgba(42, 130, 228, 1)' : '#999'"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 蓝牙控制器 -->
		<view class="lanyaList">
			<text>蓝牙遥控</text>
			<!-- 添加设备 -->
			<view class="addDevice common-box">
				<!-- <text>添加设备</text> -->
				<view class="addBtn" @click="toBleConnect">
					+ 添加蓝牙控制器
				</view>			
			</view>
			<view class="currentPC">
				<view class="deviceItem" @click="gotoBleControl(bleDevices.bleStatus)" v-if="!(Object.keys(bleDevices).length === 0)">
					<uni-icons custom-prefix="iconfont" type="icon-diannaozhuji" size="30"></uni-icons>
					<view class="text">
						<view>{{bleDevices.name}}</view>
						<view class="deviceState">
							状态：{{blePCstatus.pcStatus ? '已开机' : '已关机'}}					
						</view>
					</view>
					<view>
						<uni-icons custom-prefix="iconfont" type="icon-lanya" size="17" :color="bleDevices.bleStatus ? 'rgba(42, 130, 228, 1)' : '#999'"></uni-icons>
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import bluetooth from '../../common/ble.js';
	export default {
		data() {
			return {
				// 用户账号-用户编码
				userCode:"",
				// wifi设备列表
				userDevices:[],
				// 蓝牙设备
				bleDevices:{},
				blePCstatus:{
					pcStatus:'',
				},
			};
		},
		onLoad(option){
			// 读取本地存储的用户登录信息以及蓝牙设备信息
			this.userCode = this.vuex_user.loginCode;
			this.bleDevices = this.vuex_bleDev;	
			// this.fetchUserDevices();
		},
		onShow(){
			// 每次回到这个页面都要获取一下设备，防止有些掉线了
			// this.fetchUserDevices();
			this.bleDevices = this.vuex_bleDev;
			console.log("bledev",this.bleDevices)
			bluetooth.startNotice(this.bleDevices.bleDeviceid, this.bleDevices.bleServices, this.bleDevices.bleCharacteristicId, this.onBLECharacteristicValueChange);
		},
		methods:{
			// 获取用户设备
			async fetchUserDevices() {
				// console.log("调用接口")
				try{
					// 调用 list 接口
					const res = await this.$u.api.userDevice.list({userCode:this.userCode});
					// 成功回调
					// console.log('获取设备列表成功', res);
					this.userDevices = res.list || []; // 假设返回的数据在 res.data 中
					// console.log(JSON.stringify(this.userDevices[0]))
				}catch(err){
					// 错误回调
					console.error('获取设备列表失败', err);
				};
				// console.log("调用结束");
			},
			toBleConnect(){		// 创建蓝牙设备
				if(Object.keys(this.bleDevices).length === 0){
					uni.navigateTo({
						url:'/pages/connect/BLEconnect/BLEconnect'
					});
				}else{
					uni.showModal({
					    title: '提示', // 对话框标题
					    content: '当前已存在蓝牙设备，再次添加会覆盖当前设备，确定继续添加吗？', // 对话框内容
					    showCancel: true, // 是否显示取消按钮
					    success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/connect/BLEconnect/BLEconnect'
								});
							} else if (res.cancel) {
								console.log('用户点击了“取消”按钮');
							}
					    }
					});
				}	
			},
			toWifiConnect(){	// 创建WIFI设备
				uni.navigateTo({
					url:'/pages/connect/WIFIconnect/WIFIconnect'
				})
			},
			// 以前的配网逻辑，已放弃
			// toDistribution(){
			// 	uni.navigateTo({
			// 		url:"/pages/device/distribution/distribution"
			// 	})
			// },
			gotoWifiControl(userDeviceId,wifiStatus){
				if(wifiStatus === 0){
					uni.showModal({
						title:"提示",
						content:"当前设备wifi已离线，请重启设备进行配网",
						cancelText:"断开连接",
						success: (res) => {
							if (res.confirm) {
								console.log('用户点击了“确定”按钮');
								// 在这里执行删除设备的操作
							} else if (res.cancel) {
								console.log('用户点击了“取消”按钮');
							}
						}
					})
				}else{
					uni.navigateTo({
						url:`/pages/device/control/control?userDeviceId=${userDeviceId}`
					})
				}
			},
			gotoBleControl(bleStatus){
				if(bleStatus === 0){
					uni.showModal({
						title:"提示",
						content:"设备已离线，请重新添加",
						showCancel:false
					})
				}else{
					uni.navigateTo({
						url:'/pages/device/control/bleControl'
					})
				}
				
			},
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
					// 去掉空格并获取倒数第七位的值
					this.blePCstatus.pcStatus = result.replace(/\s/g, '').slice(-7)[6];
					console.log('电脑是否开机',this.blePCstatus.pcStatus)
					// parseReceivedData(page, receivedData);
					// console.log("监听低功耗蓝牙设备的特征值变化", JSON.stringify(result));
					// let restr = bluetooth.ab2str(result.value);
					// console.log(restr);
					
					// let msg = 'test';
					// let buffer = bluetooth.str2ab(msg);
					// bluetooth.writeData(this.curDevice.deviceId, this.curDevice.serviceId, this.curDevice.characteristicId, buffer);
				}	
			},
			
		}
	}
</script>

<style lang="scss" scoped>
.Layout{
	font-size: 35rpx;
	.pic{
		image{
			width: 100%; /* 根据需要设置宽度 */
			height: 450rpx; /* 根据需要设置高度 */
		}
	}
	
	// 设备列表
	.deviceList,.lanyaList{
		margin: 30rpx 0 20rpx;
		
		// 添加设备
		.addDevice{
			display: flex;
			align-items: center;
			width: 100%;
			height: 150rpx;
			font-weight: 700;
			margin-top: 20rpx;
			.addBtn{
				margin: 0 auto;
				border: 1px solid #2A82E4;
				border-radius: 80rpx;
				font-size: 30rpx;
				text-align: center;
				width: 350rpx;
				height: 80rpx;
				// background-color: #D4E2FD;
				line-height: 80rpx;
				color: #2A82E4;
			}
		}
		
		text{
			font-size: 38rpx;
			font-weight: 700;
		}
		.currentPC{
			margin: 10rpx 0 0;
			.deviceItem{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				padding: 30rpx;
				border-radius: 15rpx;
				background-color: #fff;
				border: 1rpx solid #eee;
				box-shadow: 0 0 30rpx rgba(0,0,0,0.1);
				height: 140rpx;
				.text{
					flex: 2;				
					margin-left: 30rpx;
					font-size: 30rpx;
					font-weight: 700;
					.deviceState{
						margin-top: 20rpx;
						font-size: 25rpx;
						font-weight: 400;
						color: $u-type-info;
					}
				}
			}
		}
	}
}
</style>
