<template>
  <!-- 刮奖 -->
  <view v-else class="scratch">
    <view class="box">
      <!-- 刮奖结果图片 -->
	  <view class="">{{name}} </view>
      <!-- <image :src="domain+prize_img" class="img"></image> -->
      <!-- 刮奖canvas容器 -->
      <canvas
        class="canvas-box"
        canvas-id="canvas-id"
        :disable-scroll="true"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      ></canvas>
      <!-- 刮奖前提示消息，开始刮奖后隐藏 -->
      <cover-view class="tip" v-if="!toDraw">
        <cover-view class="text">
          <cover-view class="text-tip">你还有</cover-view>
          <cover-view class="light">{{chance}}</cover-view>
          <cover-view class="text-tip">次刮奖机会</cover-view>
        </cover-view>
        <!-- 开始刮奖按钮 -->
        <cover-view class="btn" @tap="scratchStart()">
          <cover-image :src="domain + '/front/img/scratch-btn-bg.png'" class="btn-img"></cover-image>
          <cover-view class="text">立即刮奖</cover-view>
        </cover-view>
      </cover-view>
      <!-- 如果后端没有不中奖的图，则不中奖时默认显示 -->
      <view v-if="hasDraw" class="award-box">
        <text class="text">谢谢参与</text>
      </view>
    </view>
  </view>
</template>
 
<script>
import Scratch from '@/utils/scratch.js'
export default {
	props:['activity_id','chance'],
  data () {
    return {
      domain: getApp().globalData.baseUrl, // 服务器域名
      toDraw: false, // 是否开始刮奖
      showResult: false, // 是否显示抽奖结果
      isWin: true, // 是否中奖
      scratchWidth: 350, // 绘制刮奖范围宽
      scratchHeight: 150, // 绘制刮奖范围高
      scratchSize: 10, // 触手大小
      scratchScale: 0.25, // 需刮开百分比
      prize_img: '', // 中奖图片
      isScratching: false ,// 是否正在刮奖,
	  hasDraw:false
    }
  },
  methods: {
    initCanvas () {
      // 刮奖初始化信息必须在onReady后，不然h5不支持（小程序可在onLoad执行）
      new Scratch(this, {
        canvasId: 'canvas-id',
        width: this.scratchWidth,
        height: this.scratchHeight,
        size: this.scratchSize,
        scale: this.scratchScale
      })
    },
    // 请求刮奖结果
    doPrizeScratchTicketFun () {
      if (this.isScratching) return false
      this.isScratching = true
      // 请求服务器刮奖结果信息
	  
	  
	  this.$Z.post(getApp().globalData.reqUrl + "/activity/draw", {
	  	activity_id: this.activity_id
	  }, {
	  	native: false
	  }).then(res => {
	  	if (res.code == 1) { 
			
	  		this.name = res.data.name;
			this.luckyPrize = res.luckyPrize
			this.isWin = true
			if (this.luckyPrize.is_winning === 2) this.isWin = false
			this.isScratching = false
			
			
	  	}
	  	//异步操作成功
	  
	  }).catch(res => {
		  this.isScratching = false
	  	//异步操作失败
	  	// console.log(res)
	  }).finally(res => {
	  	//异步操作完成
	  })
	  
	  
      // this.$api.luckDraw
      //   .doPrizeScratchTicket()
      //   .then(res => {
      //     this.prize_img = res.luckyPrize.prize_img
      //     this.luckyPrize = res.luckyPrize
      //     this.isWin = true
      //     if (this.luckyPrize.is_winning === 2) this.isWin = false
      //     this.isScratching = false
      //   })
      //   .catch(() => {
      //     this.isScratching = false
      //   })
    },
    // 点击按钮开始刮奖
    scratchStart () {
      this.toDraw = true
      this.initCanvas()
      this.doPrizeScratchTicketFun()
    }
  }
}
</script>
 
<style lang="scss">
.scratch {
  width: 670upx;
  height: 320upx;
  // background: url($baseImgUrl+"luck-draw-guajiang.png") no-repeat;
  background-size: contain;
  margin: 366upx auto 80upx;
  padding: 29upx 25upx 21upx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .box {
    width: 100%;
    height: 100%;
    background:#ccc;
    border-radius: 20upx;
    position: relative;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .canvas-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100.5%;
      height: 100%;
      border-radius: 20upx;
      overflow: hidden;
    }
    .tip {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      text-align: center;
      .text {
        font-size: 30upx;
        font-weight: bold;
        color:#000;
        margin-top: 69upx;
        .text-tip {
          display: inline-block;
          vertical-align: middle;
        }
        .light {
          color: red;
          display: inline-block;
          vertical-align: middle;
          margin: 0 6upx !important;
        }
      }
      .btn {
        width: 360upx;
        height: 82upx;
        border: none;
        border-radius: 41upx;
        margin: 59upx auto 0;
        position: relative;
        background: none;
        .btn-img {
          border: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .text {
          display: inline;
          position: absolute;
          text-align: center;
          color: #fff;
          font-size: 30upx;
          font-weight: bold;
          margin: 0;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .award-box {
      width: 100%;
      height: 100%;
      border-radius: 20upx;
      text-align: center;
      line-height: 270upx;
      background: yellow;
      .text {
        font-size: 40upx;
        font-weight: bold;
        color: #000;
      }
    }
  }
}
</style>