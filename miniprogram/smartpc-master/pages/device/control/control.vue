<template>
	<view class="Layout" v-if="pcInfo !== null">
		<!-- 头部展示信息 以及 更换状态按钮 -->
		<view class="header">
			<view class="title">
				<view class="pcState">{{pcInfo.pcStatus ? '已开机' : '已关机'}}</view>
				<view class="changeState" @click="disConnect">删除设备</view>
			</view>
		</view>
		
		<!-- 机箱开关 -->
		<view class="state common-box" @click="powerCtrl">
			<uni-icons custom-prefix="iconfont" type="icon-kaiji" size="40" :color="pcInfo.pcStatus ? '#29aaff' : 'gray'"></uni-icons>
			<text>{{pcInfo.pcStatus ? '已开机' : '已关机'}}</text>
		</view>
		
		<view :class="pcInfo.pcStatus ? '' : 'disabled'" @click="openPopup">
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
					<switch :checked="pcInfo.pcFanStatus? true : false" @change="pcFanStatusChange" :disabled="pcInfo.pcStatus ? false : true" color="#29aaff"/>
				</view>
				<view class="fans">
					<!-- 进风风扇 -->
					<view class="inFans common-box">
						<view>进风</view>
						<switch :checked="pcInfo.pcFanIn? true : false" @change="fanInStatusChange" :disabled="pcInfo.pcFanStatus ? false : true" color="#29aaff"/>				
					</view>
					<!-- 出风风扇 -->
					<view class="outFans common-box">
						<view>出风</view>
						<switch :checked="pcInfo.pcFanOut? true : false" @change="fanOutStatusChange" :disabled="pcInfo.pcFanStatus ? false : true" color="#29aaff"/>						
					</view>
					
				</view>
				<view class="fansSpeed common-box">
					<view>
						<uni-icons custom-prefix="iconfont" type="icon-a-28atongfengfengshan" size="30"></uni-icons>
					</view>
					<view class="uslider">
						<u-slider v-model="pcInfo.pcFanVolume" @end="fanVolumeChange(pcInfo.pcFanVolume)" :disabled="!pcInfo.pcFanStatus" active-color="#29aaff" step="50" min="0" max="100" block-width="40" block-color="white" height="40"></u-slider>
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
					<switch :checked="pcInfo.pcLightStatus? true : false" @change="pcLightStatusChange" :disabled="pcInfo.pcStatus ? false : true" color="#29aaff"/>										
				</view>			
				<view class="lightSlider common-box">
					<view class="top">
						<uni-icons custom-prefix="iconfont" type="icon-taiyang" size="30"></uni-icons>
						<view class="littleColor" hover-class="my-button-hover" @click="openColor" :style="{ backgroundColor: 'rgb(' + pcInfo.pcLightColorR + ',' + pcInfo.pcLightColorG + ',' + pcInfo.pcLightColorB + ')' }"></view>
					</view>
					<!-- 需要声明 ref  -->
					<t-color-picker ref="colorPicker" :color="color" @confirm="confirm"></t-color-picker>
					
					<view class="sliderBox">
						<view class="uslider">
							<u-slider v-model="pcInfo.pcLightBrightness" @end="lightBrightnessChange(pcInfo.pcLightBrightness)" :disabled="!pcInfo.pcLightStatus" active-color="#29aaff" step="50" min="0" max="100" block-width="40" block-color="white" height="40"></u-slider>
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
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
	export default {
		components: {
		    tColorPicker
		},
		data() {
			return {
				timerId: null, // 用于存储定时器的 ID
				sliderValue: 0, // 初始化滑块值
				userDeviceId:"",	// 用户设备id
				pcInfo:null,
				// inchecked: true, 		// 进风开关状态
				// outchecked: true,		// 出风开关状态
				// isPoweredOn: false,		// 开关状态
				// lightPower: false,		// 灯光开关
				// lightIntensity: 50,	// 灯光亮度
				// windSpeed: 0,		// 风速
				color: {r: 0,g: 175,b: 79,a: 1},
			};
		},
		onLoad(option){
			// // 获取页面实例
			// const eventChannel = this.getOpenerEventChannel();
			// // 监听事件，接收数据
			// eventChannel.on('sendData', (data) => {
			//   console.log('接收到的数据', data.data); // data.data 是传递的对象
			//   this.pcInfo = data.data; // 将接收到的数据存储到 data 中
			// });
			this.userDeviceId = option.userDeviceId;
			this.startTimer();
			
		},
		onUnload() {
		    this.clearTimer();
		},
		methods:{
			startTimer() {
				// 启动定时器，每隔 5 秒请求一次数据
				this.timerId = setInterval(() => {
					this.getDevForm(this.userDeviceId);
				}, 5000);
			},
			clearTimer() {
				// 清除定时器
				if (this.timerId) {
					clearInterval(this.timerId);
					this.timerId = null;
				}
			},
			// 根据userDeviceId获取设备信息
			async getDevForm(userDeviceId){
				console.log("form接口")
				try{
					// 调用 save 接口
					const res = await this.$u.api.userDevice.form({
						userDeviceId:userDeviceId,
						});
					// 成功回调
					console.log('成功', res);
					this.pcInfo = res.smartcaseUserDevice; // 将接收到的数据存储到 pcInfo 中
					// console.log('PCinfo灯光RGB',JSON.stringify(this.pcInfo.pcLightColorR),JSON.stringify(this.pcInfo.pcLightColorG),JSON.stringify(this.pcInfo.pcLightColorB))
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
				
			},
			// 给设备下发命令
			async execCommand(comd,comd1,value){
				console.log("下发命令接口启动")
				// console.log(uDevId,comd,value)
				try{
					// 调用 command 接口
					const res = await this.$u.api.userDevice.command({
						userDeviceId:this.userDeviceId,
						command:comd,
						[comd1]:value
					});
					// 成功回调
					console.log('成功', res);
					this.getDevForm(this.userDeviceId);
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
				
			},
			// 修改rgb
			async rgbCommand(r,g,b){				
				try{
					// 调用 command 接口
					const res = await this.$u.api.userDevice.command({
						userDeviceId:this.userDeviceId,
						command:"lightColor",
						pcLightColorR: r,
						pcLightColorG: g,
						pcLightColorB: b
					});
					// 成功回调
					console.log('成功', res);
					this.getDevForm(this.userDeviceId);
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
				
			},
			// 根据userDeviceId删除设备
			async deleteDev(){
				console.log("删除接口")
				try{
					// 调用 delete 接口
					const res = await this.$u.api.userDevice.delete({userDeviceId:this.userDeviceId});
					// 成功回调
					console.log('成功', res);
					uni.showToast({
						title:'设备已断开'
					})
				}catch(err){
					// 错误回调
					console.error('失败', err);
				};
				console.log("调用结束");
			},
			// 断开连接
			disConnect(){
				this.deleteDev();
				setTimeout(() => {
				    uni.reLaunch({
				    	url:`/pages/index/index`
				    });
				}, 1000); // 3000毫秒后执行
				
			},
			openPopup(){
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				if(!this.pcInfo.pcStatus) this.$refs.popup.open()
			},
			// 开关机按键
			powerCtrl(){
				if(this.pcInfo.pcStatus === 1){
					this.execCommand("pcStatus","pcStatus", 0);
				}else{
					this.execCommand("pcStatus","pcStatus", 1);
				}
			},
			// 风扇总开关
			pcFanStatusChange(){
				if(this.pcInfo.pcFanStatus === 1){
					this.execCommand("fanStatus","pcFanStatus", 0);
				}else{
					this.execCommand("fanStatus","pcFanStatus", 1);
				}
			},
			// 风扇进风开关
			fanInStatusChange(){
				if(this.pcInfo.pcFanIn === 1){
					this.execCommand("fanIn","pcFanIn", 0);
				}else{
					this.execCommand("fanIn","pcFanIn", 1);
				}
			},
			// 风扇出风开关
			fanOutStatusChange(){
				if(this.pcInfo.pcFanOut === 1){
					this.execCommand("fanOut","pcFanOut", 0);
				}else{
					this.execCommand("fanOut","pcFanOut", 1);
				}
			},
			// 风扇风量
			fanVolumeChange(sliderValue){
				this.execCommand("fanVolume","pcFanVolume",sliderValue);
				console.log("测试",sliderValue)
			},
			// 灯光开光
			pcLightStatusChange(){
				if(this.pcInfo.pcLightStatus === 1){
					this.execCommand("lightStatus","pcLightStatus", 0);
				}else{
					this.execCommand("lightStatus","pcLightStatus", 1);
				}
			},
			// 灯光亮度
			lightBrightnessChange(lightBrightness){
				if(lightBrightness === 0){
					lightBrightness += 20;
				}else if(lightBrightness === 50){
					lightBrightness += 10;
				}
				this.execCommand("lightBrightness","pcLightBrightness", lightBrightness);
			},
			openColor(item) {
				// if(!this.lightPower){
				// 	return
				// }
			    // 打开颜色选择器
			    this.$refs.colorPicker.open();
			},
			confirm(e) {
				this.rgbCommand(e.rgb.r, e.rgb.g, e.rgb.b);
			}
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
