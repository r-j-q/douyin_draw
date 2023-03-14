<template>
	<view class="ji">
		<view class="lucky" v-if="gameType==1">
			<view class="title">
				<image src="../../static/event/lucky/title.png" mode="aspectFill"></image>
			</view>
			<view class="turntable">
				<view class="gift" v-for="(item,index) in giftlist" :key="index">
					<view class="giftBox">
						<image :src="item.image" mode="aspectFill" v-if="item.drawType"></image>
						<text :class="{nogift:!item.drawType}">{{item.name}}</text>
					</view>

					<view class="giftMask" v-if="index == roll"></view>
				</view>
				<view class="draw" @click="draw" v-if="!isDraw"></view>
				<view class="draw drawing" v-else></view>
			</view>
			<view class="chances">
				<text>您还有{{chance}}次机会</text>
			</view>
			<!-- <view class="">
		 		{{base64Url}}
		 	</view> -->
			<!-- <view class="button">
		 		<view class="btn rule" @click="maskShow(1)">
		 			<text>抽奖规则</text>
		 		</view>
		 		<view class="btn record" @click="maskShow(2)">
		 			<text>中奖记录</text>
		 		</view>
		 		http://bdsh.shningmi.com
		 	</view> -->
			<view class="mask" v-if="isMask!=0">
				<!-- 	<view class="ruleBox" v-if="isMask==1">
		 			<view class="title">
		 				<image src="../../static/event/lucky/star.png" mode="aspectFill"></image>
		 				<text>抽奖规则</text>
		 				<image src="../../static/event/lucky/star.png" mode="aspectFill"></image>
		 			</view>
		 			<view class="textBox">
		 				<text>
		 					1、必须是在APP登录后才可参与抽奖<br />
		 					2、每人仅可抽一次<br />
		 					3、抽奖页面不可转发，仅限APP内抽奖<br />
		 				</text>
		 			</view>
		 		</view>
		 
		 		<view class="recordBox" v-if="isMask==2">
		 			<view class="title">
		 				<image src="../../static/event/lucky/star.png" mode="aspectFill"></image>
		 				<text>中奖记录</text>
		 				<image src="../../static/event/lucky/star.png" mode="aspectFill"></image>
		 			</view>
		 			<view class="textBox">
		 				<view class="time">
		 					<text class="point"></text>
		 					<text>03月2日 14:04</text>
		 				</view>
		 				<view class="prize">
		 					<text>1元购全年企业法律服务套餐</text>
		 				</view>
		 			</view>
		 		</view> -->
				<!-- <html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish"> -->
				<view id="htmlCanvas" class="getGiftBox" v-if="isMask==3">

					<view class="title" v-if="gift.drawType">
						恭喜抽中<br />
						{{gift.name}}
					</view>
					<view class="title" v-else>
						很遗憾<br />
						您与奖品擦肩而过
					</view>
					<image src="../../static/event/lucky/getgift.png" mode="aspectFill" @click="getGift"
						v-if="gift.drawType"></image>
					<image src="../../static/event/lucky/nogift.png" mode="aspectFill" v-else></image>
				</view>
				<!-- </html2canvas> -->
				<image class="close" src="../../static/event/lucky/close.png" mode="aspectFill" @click="maskShow(0)">
				</image>
			</view>
			<a type="primary" class="button-video" :href="schema">发布视频</a>
			<a type="primary" class="button-video" style="margin-top: 50upx;" @click="jumpToList">抽奖记录</a>
		</view>

		<view class="" v-if="gameType==2">
			<view class="guagua-0">
				<image class="guagua" :src="gou" mode=""></image>
			</view>
			<view class="gua-gua-d-top">
				<view class="an_ne">{{company || "浙江XXXXXX公司"}} </view>
				<view class="gua-gua-d">
					<gameg :name="name" :chance="chance" :disabled="disabled" />
				</view>

			</view>
			<a type="primary" class="button-video-style" :href="schema">发布视频</a>
			<a type="primary" class="button-video-style" style="margin-top: 50upx;" @click="jumpToList">抽奖记录</a>
			<view class="baocunxiangce">
				刮奖后，请截图保存到相册
			</view>

		</view>
	</view>
</template>

<script module="renderScript" lang="renderjs">
	import gameg from './gameg'
	import html2canvas from '@/components/dyw-html2image/html2canvas.min.js';
	// import guagua from "@/components/guagua/index.vue"
	export default {
		components: {
			gameg
		},
		data() {

			return {
				gou: require("../../static/img/gua.jpg"),
				gameType: 1,
				ifShareVideo: false,
				domId: '#poster',
				filePath: '',
				logoBase64: '',
				giftlist: [],
				chance: 0, //可以抽奖次数
				isMask: 0, //0不展示，1规则，2记录，3中奖界面
				isDraw: false, //是否正在摇奖，false未摇，true摇
				roll: 0, //从0开始滚动
				result: "", //抽奖结果
				interval: '', //按时间间隔持续调用函数
				timeout: '', //定时器
				gift: {}, //获得的奖品详情

				base64Url: "",
				activity_id: 53,
				name: "",
				company: "",
				activity_id_choujiang: "",
				schema: "",
				disabled: false

			};
		},
		onLoad() {
			let _this = this;

			try {
				uni.setStorageSync(
					'storage_user', {
						token: getApp().getRequestParams().token.replace('#/', ''),
						reqUrl: "https://" + window.location.host+ '/addons/shopro' ,
					},
				)
			} catch (e) {
				// error
			}

			// getApp().globalData.token= getApp().getRequestParams().token.replace('#/',''); 
			// getApp().getRequestUrl(window.location.host);
			_this.activity_id = window.location.href.match(/\?activity\_id\=(\d+)/)[1];


			setTimeout(() => {
				_this.getChoujiangYouXi(_this.activity_id);
			}, 200)



		},
		onShow() {

			// let ua = navigator.userAgent.toLowerCase();
			// if (ua.match(/MicroMessenger/i) == "micromessenger") {
			// 	//微信浏览器

			// } else {
			// 	//不是
			// 	// this.com.rel('./page_fail') 
			// }
		},
		methods: {
			jumpToList() {
				uni.navigateTo({
					url: "/pages/game/list"
				})
			},
			renderFinish(filePath) {

				this.filePath = filePath;
			},

			// 点击抽奖获取的奖品


			// 点击抽奖获取的奖品
			getDraw() {
				const t = uni.getStorageSync('storage_user');
				this.$Z.post(t.reqUrl + "/activity/draw", {
					activity_id: this.activity_id,
					token: t.token
				}, {
					native: false
				}).then(res => {
					if (res.code == 1) {
						this.activity_id_choujiang = res.data.id;
						this.name = res.data.name;
						this.chance = res.data.draw_num;
					} else {

						uni.showToast({
							icon: "none",
							title: res.msg
						})

						this.chance = 0
						this.disabled = true

					}
					//异步操作成功

				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},
			getChoujiangYouXi(activity_id) {
				const t = uni.getStorageSync('storage_user');
				this.$Z.post(t.reqUrl + "/activity/game", {
					activity_id,
					token: t.token
				}, {
					native: false
				}).then(res => {
					if (res.code == 1) {
						this.chance = res.data.draw_num;
						console.log("请求的域名", this.chance)
						this.company = res.data.company;
						this.gameType = res.data.type;
						this.giftlist = res.data.awards;
						if (res.data.type == 2) {
							this.getDraw()
						}
						this.getVideo()

					} else {
						uni.showToast({
							icon: "none",
							title: res.msg
						})
					}
					//异步操作成功
					// console.log('this.giftlist', this.giftlist)
				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},
			//获取视频发布链接  
			async getVideo() {
				let systemPhone = uni.getSystemInfoSync();
				const t = uni.getStorageSync('storage_user');
				this.$Z.post(t.reqUrl + "/activity/index", {
					activity_id: this.activity_id,
					token: t.token
				}, {
					native: false
				}).then(res => {
					this.schema = res.data.schema



				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},

			async getTrimVideo() {


				this.$Z.post(t.reqUrl + "/activity/trimVideo?id=1", {}, {
					native: false
				}).then(res => {
					//异步操作成功
					// console.log('==========...', res)
				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},

			//视频检测   http://bdsh.shningmi.com/addons/shopro/activity/trimVideo?id=1
			// 开始抽奖
			draw() {
				this.getDraw();
				if (this.chance > 0) {
					// this.chance--
					this.isDraw = true
					clearInterval(this.interval)
					this.interval = setInterval(() => {
						this.roll++
						if (this.roll >= 8) {
							this.roll = 0
						}
					}, 200);
					// 5秒中后出随机数结果
					this.timeout = setTimeout(() => {
						this.getResult()
						this.stopDraw()
						clearTimeout(this.timeout)
					}, 5000)
				} else {
					uni.showToast({
						title: '已无抽奖机会',
						icon: 'none'
					})
				}
			},
			// 随机数获得最终结果
			getResult() {
				let _this = this;

				let idtype = _this.activity_id_choujiang;
				_this.giftlist.forEach((item, i) => {
					if (item.id == idtype) {
						_this.result = i;
					}
				})

			},
			// 抽奖结束
			stopDraw() {
				var stop = setInterval(() => {
					if (this.roll == this.result) {
						clearInterval(this.interval)
						clearInterval(stop)
						this.isDraw = false
						this.gift = this.giftlist[this.result]
						setTimeout(() => {
							this.maskShow(3)
						}, 1000)
					}
				}, 10)
			},
			// 遮罩层展示
			maskShow(type) {
				this.isMask = type;

				// if(type==3){
				// 	uni.showToast({
				// 		icon: "none",
				// 		duration:3000,
				// 		title: "截图保存到相册"
				// 	})
				// }

			},
			getGift(ownerVm) {
				let _this = this;

				// 获取链接
				_this.maskShow(0)


				this.ifShareVideo = true

				// const dom = document.getElementById('htmlCanvas');
				// html2canvas(dom, {
				// 	width: dom.clientWidth, //dom 原始宽度
				// 	height: dom.clientHeight,
				// 	scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
				// 	scrollX: 0,
				// 	dpi: 300,
				// 	useCORS: true, //支持跨域，但好像没什么用
				// 	allowTaint: false
				// }).then((canvas) => {
				// 	const base64 = canvas.toDataURL('image/jpeg', 1);
				// 	_this.saveBaseImgFile(base64)

				// });


			},
			saveBaseImgFile(base64) {
				this.base64Url = base64
				// console.log('ownerVm', base64)
				// uni.saveImageToPhotosAlbum({
				// 	filePath: base64,
				// 	success: function() {
				// 		uni.showToast({
				// 			title: '图片保存成功',
				// 			icon: 'none'
				// 		})
				// 		bitmap.clear()
				// 	}
				// });

			}

		}
	}
</script>

<style lang="scss">
	// 引入字体
	@font-face {
		font-family: 'jiangxizhuokai';
		src: url('~@/static/font/jiangxizhuokai.TTF');
	}

	.ji {
		background-color: #dd1539;
		min-height: 100vh;
	}

	.guagua-0 {
		width: 100%;
		height: 500upx;
	}

	.guagua-0 image {
		width: 100%;
		height: 100%;
	}

	.gua-gua-d-top {

		padding-top: 100upx;
		margin-top: -2upx;
	}

	.gua-gua-d {
		// background-color: #f6bb21;

	}

	.baocunxiangce {
		font-size: 12px;
		color: #ccc;
		margin-top: 100upx;
		text-align: center;
	}

	.an_ne {
		width: 80%;
		margin: 0 auto;
		font-size: 16px;
		padding: 20upx 0;
		margin-bottom: 50upx;
		text-align: center;
		color: #FFFFFF;
		// border: 2px solid #fff;
		// background-image: linear-gradient(to right, #dde539, #f6bb21);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lucky {
		width: 100%;
		height: 100vh;
		background-image: url(../../static/event/lucky/back.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.title {
			image {
				width: 436rpx;
				height: 121rpx;
				display: block;
				margin: 0 auto 50rpx;
			}
		}

		.turntable {
			width: 650rpx;
			height: 650rpx;
			position: relative;
			margin: 0 auto;
			background-image: url(../../static/event/lucky/turntableBack.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;

			.gift,
			.draw {
				width: 172rpx;
				height: 172rpx;
				overflow: hidden;
				position: absolute;
				background: linear-gradient(0deg, #FFE5E5 0%, #FFFFFF 100%);
				box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0, 0, 0, 0.31);
				border-radius: 10rpx;
			}

			.gift {
				.giftBox {
					position: relative;
					text-align: center;

					image {
						width: 110rpx;
						height: 110rpx;
					}

					text {
						display: block;
						margin-top: 12rpx;
						text-align: center;
						font-size: 26rpx;
						font-family: jiangxizhuokai;
						font-weight: 400;
						color: #323232;
					}

					.nogift {
						display: block;
						width: 61rpx;
						height: 69rpx;
						margin: 50rpx auto;
						font-size: 30rpx;
						font-family: jiangxizhuokai;
						font-weight: 400;
						color: #323232;
					}
				}
			}

			.gift:nth-child(1) {
				top: 53rpx;
				left: 56rpx;
			}

			.gift:nth-child(2) {
				top: 53rpx;
				left: 239rpx;
			}

			.gift:nth-child(3) {
				top: 53rpx;
				right: 56rpx;
			}

			.gift:nth-child(4) {
				top: 236rpx;
				right: 56rpx;
			}

			.gift:nth-child(5) {
				bottom: 59rpx;
				right: 56rpx;
			}

			.gift:nth-child(6) {
				bottom: 59rpx;
				left: 239rpx;
			}

			.gift:nth-child(7) {
				bottom: 59rpx;
				left: 56rpx;
			}

			.gift:nth-child(8) {
				top: 236rpx;
				left: 56rpx;
			}

			.draw {
				top: 236rpx;
				left: 239rpx;
				background-image: url(../../static/event/lucky/draw.png);
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;
			}

			.drawing {
				background-image: url(../../static/event/lucky/draw_ing.png);
			}

			.giftMask {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				background: rgba($color: #000000, $alpha: 0.2);
			}

		}

		.chances {
			width: 280rpx;
			height: 50rpx;
			margin: 0 auto;
			background: #F0352D;
			border-radius: 0rpx 0rpx 25rpx 25rpx;
			text-align: center;
			line-height: 50rpx;

			text {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 800;
				letter-spacing: 5rpx;
				color: #FFFFFF;
			}
		}

		.button {
			margin-top: 80rpx;
			margin-bottom: 150rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.btn {
				width: 260rpx;
				height: 80rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 4rpx 9rpx 0rpx rgba(255, 98, 60, 0.6);
				border-radius: 10rpx;
				text-align: center;
				line-height: 80rpx;

				text {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 800;
				}
			}

			.rule {
				margin-right: 80rpx;
				color: #FF623C;
			}

			.record {
				background-color: #FF623C;
				color: #FFFFFF;
			}
		}

		.mask {
			width: 100%;
			height: 100vh;
			background-color: rgba($color: #000000, $alpha: 0.6);
			position: absolute;
			top: 0;
			left: 0;

			.ruleBox,
			.recordBox {
				width: 444rpx;
				height: 582rpx;
				background: #F9C437;
				border-radius: 20rpx;
				margin: 336rpx auto 0;
				padding: 39rpx 48rpx;

				.title {
					margin-bottom: 30rpx;
					display: flex;
					justify-content: center;

					image {
						width: 51rpx;
						height: 44rpx;
					}

					text {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 800;
						color: #FFFFFF;
					}
				}

				.textBox {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 800;
					color: #FFFFFF;
					line-height: 35rpx;

					.time {
						position: relative;

						.point {
							position: absolute;
							left: -20rpx;
							top: 50%;
							transform: translateY(-50%);
							display: block;
							width: 8rpx;
							height: 8rpx;
							background: #FFFFFF;
							border-radius: 50%;
						}
					}
				}
			}

			.getGiftBox {
				width: 500rpx;
				height: 600rpx;
				position: relative;
				background-image: url(../../static/event/lucky/redbag.png);
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
				margin: 296rpx auto 0;

				.title {
					text-align: center;
					font-size: 30rpx;
					font-family: jiangxizhuokai;
					font-weight: 400;
					color: #323232;
					line-height: 40rpx;
					position: absolute;
					top: 269rpx;
					left: 50%;
					transform: translateX(-50%);
				}

				image {
					width: 165rpx;
					height: 165rpx;
					position: absolute;
					bottom: 18rpx;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.close {
				width: 50rpx;
				height: 50rpx;
				margin-top: 32rpx;
				position: relative;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.button-video {
		background-color: red;
		color: #fff;
		width: 80%;
		padding: 30upx 20px;
		text-align: center;
		border-radius: 10px;
		margin-top: 60upx;
		text-decoration: none;
	}

	.button-video-style {
		background-color: #fff;
		color: #000;
		width: 70%;
		padding: 15px 20px;
		border-radius: 10px;
		text-decoration: none;
		display: block;
		text-align: center;
		margin: 0 auto;
		margin-top: 31px;
	}
</style>
