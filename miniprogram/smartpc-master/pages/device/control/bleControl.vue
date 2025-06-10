<template>
	<view class="Layout" >  
		<!-- 头部展示信息 以及 更换状态按钮  //v-if="pcInfo !== null"-->
		<view class="header">
			<view class="title">
				<view class="pcState">{{(pcStatus === '1') ? '已开机' : '已关机'}}</view>
				<view class="changeState" @click="disConnect">删除设备</view>
			</view>
		</view>
		
		<!-- 机箱开关 -->
		<view class="state common-box" @click="powerCtrl">
			<uni-icons custom-prefix="iconfont" type="icon-kaiji" size="40" :color="pcStatus === '1' ? '#2A82E4' : 'gray'"></uni-icons>
			<text>{{(pcStatus === '1') ? '已开机' : '已关机'}}</text>
		</view>
		
		<view :class="pcStatus === '1' ? '' : 'disabled'" @click="openPopup">
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" background-color="#fff">
				<view class="popbox">
					<view class="popTitle">设备已关机</view>
					<view>请开机再尝试控制功能</view>
				</view>
			</uni-popup>
			<!-- 机箱风扇 -->
			<view class="fansBlock common-box">
				<view class="fansHeader">
					<view>机箱风扇</view>
					<!-- <switch :checked="isPoweredOn? true : false" @change="pcFanStatusChange" :disabled="pcStatus ? false : true" color="#2A82E4"/> -->
				</view>
				<view class="fans">
					<!-- 进风风扇 -->
					<view class="inFans common-box">
						<view>进风</view>
						<!-- <switch :checked="inchecked ? true : false" @change="fanInStatusChange" :disabled="isPoweredOn ? false : true" color="#2A82E4"/> -->
						<switch :checked="inchecked === '1' ? true : false" @change="fanInStatusChange" color="#2A82E4"/>
					</view>
					<!-- 出风风扇 -->
					<view class="outFans common-box">
						<view>出风</view>
						<!-- <switch :checked="outchecked ? true : false" @change="fanOutStatusChange" :disabled="isPoweredOn ? false : true" color="#2A82E4"/> -->
						<switch :checked="outchecked === '1' ? true : false" @change="fanOutStatusChange" color="#2A82E4"/>
					</view>
					
				</view>
				<view class="fansSpeed common-box">
					<view>
						<uni-icons custom-prefix="iconfont" type="icon-a-28atongfengfengshan" size="30"></uni-icons>
					</view>
					<view class="uslider" @click="fanVolumeChange(windSpeed)">
						<u-slider v-model="windSpeed" @end="fanVolumeChange(windSpeed)" active-color="#2A82E4" step="50" min="0" max="100" block-width="60" block-color="white" height="40">
							
						</u-slider>
					</view>
					<view class="text">
						<text>低</text>
						<text>中</text>
						<text>高</text>
					</view>
				</view>
			</view>
			
			<!-- 机箱灯光 -->
			<view class="lightBlock common-box">
				<view class="lightHeader">
					<view>灯光</view>
					<switch :checked="lightPower ? true : false" @change="pcLightStatusChange" color="#2A82E4"/>										
				</view>			
				<view class="lightSlider common-box">
					<view class="top">
						<uni-icons custom-prefix="iconfont" type="icon-taiyang" size="30"></uni-icons>
						<view class="littleColor" hover-class="my-button-hover" @click="openColor" ></view>
					</view>
					<!-- 需要声明 ref  -->
					<t-color-picker ref="colorPicker" :color="color" @confirm="confirm"></t-color-picker>
					
					<view class="sliderBox">
						<view class="uslider">
							<u-slider v-model="lightIntensity" @end="lightBrightnessChange(lightIntensity)" :disabled="!lightPower" active-color="#2A82E4" step="50" min="0" max="100" block-width="40" block-color="white" height="40"></u-slider>
						</view>
						<view class="text">
							<text>20%</text>
							<text>60%</text>
							<text>100%</text>
						</view>
					</view>
				</view>		
			</view>
		</view>
	</view>
</template>

<script>
	import bluetooth from '../../../common/ble.js';
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
	export default {
		components: {
		    tColorPicker
		},
		data() {
			return {
				sliderValue: 0, // 初始化滑块值
				userDeviceId:"",	// 用户设备id
				pcInfo:null,
				pcStatus: '',		// 已开机/已关机
				inchecked: '', 		// 进风开关状态
				outchecked: '',		// 出风开关状态
				windSpeed: 0,		// 风速
				isPoweredOn: false,		// 风扇总开关状态（已弃用
				lightPower: false,		// 灯光开关
				lightIntensity: 50,	// 灯光亮度
				color: {r: 0,g: 175,b: 79,a: 1},
				bleDevices:{},
			};
		},
		onLoad(option){
			// 读取蓝牙设备
			this.bleDevices = this.vuex_bleDev;	
		},
		onShow(){
			// 每次回到这个页面都要获取一下设备，防止有些掉线了
			this.bleDevices = this.vuex_bleDev;
			console.log("控制页bledev",this.bleDevices)
			bluetooth.startNotice(this.bleDevices.bleDeviceid, this.bleDevices.bleServices, this.bleDevices.bleCharacteristicId, this.onBLECharacteristicValueChange);
		},
		methods:{
			openPopup(){
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				if(this.pcStatus === '0') this.$refs.popup.open()
			},
			disConnect(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
				// 调用Vuex的mutation来清空vuex_bleDev
				this.$store.commit('clearVuexBleDev');
				
			},
			// 开关机按键
			powerCtrl(){
				
			},
			// 风扇进风开关
			fanInStatusChange(){
				let dataToSend = "";
				if(this.inchecked === '1'){
					this.inchecked = '0';
					dataToSend = "a5 fa 00 03 15 00 b7 fb"; // 示例数据
				}else{
					this.inchecked = '1';
					dataToSend = "a5 fa 00 03 13 00 b5 fb"; // 示例数据
				}
				
				bluetooth.writeData(this.bleDevices.bleDeviceid, this.bleDevices.bleServices, this.bleDevices.bleWriteCharacteristicId, dataToSend);
			},
			// 风扇出风开关
			fanOutStatusChange(){
				let dataToSend = "";
				if(this.outchecked === '1'){
					this.outchecked = '0';
					dataToSend = "a5 fa 00 03 16 00 b8 fb"; // 示例数据
				}else{
					this.outchecked = '1';
					dataToSend = "a5 fa 00 03 14 00 b6 fb"; // 示例数据
				}
				bluetooth.writeData(this.bleDevices.bleDeviceid, this.bleDevices.bleServices, this.bleDevices.bleWriteCharacteristicId, dataToSend);
			},
			// 风扇风量
			fanVolumeChange(sliderValue){
				let dataToSend = "";
				if(sliderValue === 0){
					dataToSend = "a5 fa 00 03 06 00 a8 fb"; // 最小风量
				}else if(sliderValue === 50){
					dataToSend = "a5 fa 00 03 05 00 a7 fb"; // 中等风量
				}else if(sliderValue === 100){
					dataToSend = "a5 fa 00 03 04 00 a6 fb"; // 最大风量
				}
				console.log("风速：",sliderValue)
				bluetooth.writeData(this.bleDevices.bleDeviceid, this.bleDevices.bleServices, this.bleDevices.bleWriteCharacteristicId, dataToSend);
			},
			// 灯光开光
			pcLightStatusChange(){
				
			},
			// 灯光亮度
			lightBrightnessChange(lightBrightness){
				
			},
			openColor(item) {
			    // 打开颜色选择器
			    this.$refs.colorPicker.open();
			},
			confirm(e) {
				// this.rgbCommand(e.rgb.r, e.rgb.g, e.rgb.b);
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
			// 蓝牙特征值变化
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
					// this.pcStatus = result.replace(/\s/g, '').slice(-7)[6];
					// console.log('电脑是否开机',this.pcStatus)
					
					
					// 去掉空格
					let binaryStringNoSpaces = result.replace(/\s/g, '');
					
					// 提取各部分信息
					let lightColor = binaryStringNoSpaces.slice(-6).slice(0, 6); // 倒数6位
					let hostStatus = binaryStringNoSpaces[binaryStringNoSpaces.length - 7]; // 倒数第7位
					let intakeFanStatus = binaryStringNoSpaces[binaryStringNoSpaces.length - 8]; // 倒数第八位
					let exhaustFanStatus = binaryStringNoSpaces[binaryStringNoSpaces.length - 9]; // 倒数第九位
					let fanSpeed = binaryStringNoSpaces.slice(5,7); // 倒数1011位
					
					// 输出结果
					console.log("灯光颜色:", lightColor);
					console.log("主机状态:", hostStatus);
					console.log("进风风扇状态:", intakeFanStatus);
					console.log("出风风扇状态:", exhaustFanStatus);
					console.log("风扇速度:", fanSpeed);
					this.pcStatus = hostStatus;
					this.inchecked = intakeFanStatus;
					this.outchecked = exhaustFanStatus;
					if(fanSpeed === '01'){
						this.windSpeed = 0;
					}else if(fanSpeed === '10'){
						this.windSpeed = 50;
					}else if(fanSpeed === '11'){
						this.windSpeed = 100;
					}
					
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

<style lang="scss">
.disabled{
	color: $u-type-info-disabled;
}
.Layout{
	font-size: 35rpx;
	// 头部状态
	.header{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: left;
		margin-bottom: 10rpx;
		padding: 30rpx;
		width: 100%;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 50rpx;
			.pcState{
				font-size: 70rpx;
				font-weight: 700;
				color: #303133;
			}
			.changeState{
				border-radius: 72rpx;
				border: 1rpx solid #eee;
				box-shadow: 0 0 30rpx rgba(0,0,0,0.05);
				width: 180rpx;
				height: 80rpx;
				background-color: #D4E2FD;
				color: #2A82E4;
				font-size: 30rpx;
				line-height: 80rpx;
				text-align: center;
			}
		}
	}
	// 开关机
	.state{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 200rpx;
	}
	// 底部弹窗
	.popbox{
		padding: 30rpx;
		color: #000;
		height: 300rpx;
		text-align: center;
		.popTitle{
			margin-bottom: 40rpx;
			font-weight: 700;
			
		}
	}
	
	// 机箱风扇
	.fansBlock{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		font-size: 35rpx;
		.fansHeader{
			display: flex;
			justify-content: space-between;
		}
		.fans{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 30rpx 0 0 0;
			.inFans,.outFans{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 250rpx;
				height: 130rpx;
				
			}
		}
		.fansSpeed{
			
			.uslider{
				margin: 20rpx 0;
				padding: 0 30rpx;
			}
			.text{
				display: flex;
				justify-content: space-between;
			}
		}
	}
	
	// 机箱灯光
	.lightBlock{
		font-size: 35rpx;
		.lightHeader{
			display: flex;
			justify-content: space-between;
		}
		.lightSlider{
			margin: 20rpx 0;
			.top{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.littleColor{
					margin-right: 30rpx;
					border: 2px solid #eee;
					width: 50rpx;
					height: 50rpx;
					border-radius: 8rpx;
					background-color: pink;

				}
				.my-button-hover{
					border: 2px solid #2A82E4;
					transition: all 0.3s;
					transform: scale(1.1);
				}
			}
				
			.sliderBox{
				.uslider{
					margin: 20rpx 0;
				}
				.text{
					display: flex;
					justify-content: space-between;
					
				}
			}
		}
	}
}
</style>
