<template>
    <view class="Layout">
		<view class="head">
			<view class="logo">
				<image src="/static/uview/example/js_bak.png" mode="aspectFill"></image>
			</view>
			<view class="title">智能主机</view>
		</view>
		
		
		<view class="protocol">
			<view class="content">
				<checkbox class="custom-checkbox" value="cb" checked="true" />
				<text class="text">勾选代表您已同意<text style="color:#2A82E4;">个人信息保护政策</text>和<text style="color:#2A82E4;">智能主机服务条款</text></text>
			</view>
		</view>
		
		<view class="btn">
			<view class="button" hover-class="button-hover" @click="submit()">一键登录</view>
		</view>
		
	</view>
</template>
<script>
    export default {
        data() {
            return {
               
            }
        },
        onLoad() {
			
        },
        methods: {
			
        }
    }
</script>

<style lang="scss">
.Layout{
	.head{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 200rpx auto;
		.logo{
			margin-bottom: 30rpx;
			width: 200rpx;
			height: 200rpx;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.title{
			font-size: 35rpx;
			color: #2A82E4;
		}
	}
	
	.protocol{
		.content{
			.custom-checkbox{
				transform: scale(0.7); /* 可选：通过缩放进一步调整大小 */
			}
			.text{
				font-size: 25rpx;
			}
		}
	}
	
	.btn{
		margin-top: 30rpx;
		.button{
			position: relative; /* 确保伪元素相对于按钮定位 */
			border-radius: 10rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			font-size: 35rpx;
			background-color: limegreen;
			overflow: hidden; /* 防止伪元素超出按钮范围 */
		}
		
		/* 遮罩样式 */
		.button::after {
		  content: "";
		  position: absolute;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background-color: rgba(0, 0, 0, 0.1); /* 半透明黑色 */
		  opacity: 0; /* 默认不显示 */
		  // transition: opacity 0.1s ease-in-out;
		  z-index: 1;
		}
		
		/* 按钮内容层级 */
		.button span {
		  position: relative;
		  z-index: 2;
		}
		
		/* 按下状态 */
		.button-hover::after {
		  opacity: 1; /* 显示遮罩 */
		}
	}
}
</style>
