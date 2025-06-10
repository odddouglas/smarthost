<template>
	<view>
		<!-- 顶部标签栏 -->
					<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
					    <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
					        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
						</view>
					</scroll-view>
					
					<view class="line-h"></view>
					
					<!-- 当tabIndex为0时，显示设备列表 -->
					<view class="dev-list-view" v-if="tabIndex === 0">
						<!-- 设备列表，如果为空则显示 无设备列表 -->
						<scroll-view v-if="bleDevList.length>0" id="dev-list" class="dev-item-list">
							<view class="bluetoothSearchItem" v-for="(dev,index) in bleDevList" :key="index" :id="index" @click="bleConnect(dev)">
								<view class="itemList">
									<text>设备地址:  {{ dev.deviceId }}</text>
								</view>
								<view class="itemList">
									<text>信号:{{ dev.RSSI }}</text>
								</view>
								<view class="itemList">
									<text>设备名称:  {{ dev.name }}</text>
								</view>
							</view>
						</scroll-view>
						
						<view class="tips" v-else>
							<text>无可用设备，下拉刷新</text>
						</view>
					</view>
					<!-- 否则显示活动连接 -->
					<view class="dev-debug-view" v-else>
						<view class="itemList">
							<text>设备名称:  {{ curDevice.name }}</text>
						</view>
						<view class="itemList">
							<text>设备地址:  {{ curDevice.deviceId }}</text>
						</view>
						<view class="itemList">
							<text>服务:{{ curDevice.serviceId }}</text>
						</view>
						<view class="itemList">
							<text>特征:{{ curDevice.characteristicId }}</text>
						</view>
						<view v-if="curDevice.name">
							<button @click="disconnectBle">断开连接</button>
						</view>
						
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

</style>
