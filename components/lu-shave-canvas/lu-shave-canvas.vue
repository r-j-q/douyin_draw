<template>
	<!-- 刮一刮 -->
	<view class="shave-section show">
		<view class="shave-box">
			<view class="text_box">
				<view class="shave_box">
					<image class="shaveTxt" src="../../static/shave_img_text01.png"></image>
					<canvas class="canvas" @touchstart="start" @touchend="end" @touchmove="move" v-if="!clearAll" canvas-id="canvasA" id="canvasA"></canvas>
					<view class="tip_gd"><image src="../../static/huadong.png"></image></view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				clearAll:false,
			};
		},
		created() {
			this.$nextTick(()=>{
				this.initDrawCanvas()
			})
		},
		methods: {
			//绘制|重置或绘制canvas内容
			initDrawCanvas(){
				this.clearAll = false;
				this.$nextTick(()=>{
					const query = uni.createSelectorQuery().in(this);
					//设置初始化
					query.select('#canvasA').boundingClientRect(data => {
					  let width = data.width;
					  let height = data.height;
					  this.init({
					  	canvasId: 'canvasA',
					  	regionPer: 98,
						width:width,
						height:height,
						size:12,
					  });
					}).exec()
				})
			},
			//绑定的手指移动事件
			start(e) {
				this.eraser(e);
			},
			move(e) {
				this.eraser(e);
			},
			end(e) {
				this.getFilledPercentage().then((data)=>{
					if(parseInt(data) >= this.regionPer) { //刮的区域大于等于设定的值就清除canvas
						this.clearAll = true;
						if (this.clearAll) {
							this.ctx.clearRect(0, 0, this.width, this.height);
							this.ctx.draw();
						}
					}
				})
			},
			//初始化参数信息
			init(opts) {
				opts = opts || {};
				this.canvasId = opts.canvasId || 'canvasId';
				this.width = opts.width || 200;//宽默认为刮区200px
				this.height = opts.height || 100;//高默认刮区100px
				this.maskColor = opts.maskColor || '#000000';//刮区蒙版颜色
				this.rw = opts.size || 12;//刮
				this.regionPer = opts.regionPer || 90;//清除区域百分比| 默认刮了90%清除全部蒙版
				this.clearAll = false;
				this.ctx = uni.createCanvasContext(this.canvasId, this);
				this.drawMask();
			},
			//填充内容蒙版————绘制的内容 | 这块可自己自由发挥修改(ps其它逻辑可以完全不变)
			drawMask() {
				//绘制文字
				// this.ctx.setFillStyle(this.maskColor);
				// this.ctx.fillRect(0, 0, this.width, this.height);
				// this.ctx.setFontSize(20)
				// this.ctx.setFillStyle('red')
				// this.ctx.fillText('Hello Word', 20, 20)
				//绘制图案
				this.ctx.drawImage('../../static/shave_img_text02.png', 0, 0, uni.upx2px(548), uni.upx2px(420))
				this.ctx.draw();
			},
			//清除轨迹
			eraser(e) {
				let x = e.touches[0].x,
					y = e.touches[0].y;
				this.ctx.clearRect(x, y, this.rw, this.rw);
				this.ctx.draw(true);
			},
			//计算清除的百分占比
			getFilledPercentage() {
				const fillePercent= new Promise((resolve) => {
					uni.canvasGetImageData({
						canvasId:this.canvasId,
						x:0,
						y:0,
						width:this.width,
						height:this.height,
						success: (res) =>{
							// res.data是个数组，存储着指定区域每个像素点的信息，数组中4个元素表示一个像素点的rgba值
							let pixels = res.data;
							let transPixels = [];
							for(let i = 0; i < pixels.length; i += 4) {
								// 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
								// 为了提高计算效率，这儿设置当a值小于128，也就是半透明状态时就可以了
								if(pixels[i + 3] < 128) {
									transPixels.push(pixels[i + 3]);
								}
							}
							resolve((transPixels.length / (pixels.length / 4) * 100).toFixed(2))
						}
					})
				})
				return fillePercent
			}
		}
	}
</script>

<style lang="stylus">
	.shave-section{
		position absolute
		left 0
		top 0
		bottom 0
		right 0
		background-color rgba(0,0,0,.8)
		z-index 9
		display none
		&.show{
			display block
		}
		.shave-box{
			width 100%
			height 100%
			position absolute
			left 0
			top 0
			bottom 0
			right 0
			.text_box{
				width 100%
				height 100%
				display flex
			}
			.shave_box{
				width 667rpx
				height 546rpx
				position absolute
				left 0
				right 0
				top 40%
				transform translateY(-50%)
				margin auto
			}
			.shaveImg{
				width 668rpx
				height 494rpx
			}
			.shaveTxt{
				width 548rpx
				height 420rpx
				position absolute
				left 0
				right 0
				bottom 0
				margin auto
			}
			.canvas{
				width 548rpx
				height 420rpx
				position absolute
				left 0
				right 0
				bottom 0
				margin auto
			}
			.tip_gd{
				width 310rpx
				height 157rpx
				background url(../../static/huadong.png) no-repeat center
				background-size 100%
				position absolute
				left 80rpx
				right 0
				bottom -200rpx
				margin auto
				image{
					width 100%
					height 100%
				}
			}
		}
	}
</style>
