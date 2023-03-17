<template>
	<view class="lists">
		<view class="lists-title">
			中奖列表
		</view>
		<view class="wujilv" v-if="lists.length==0">
			暂无记录
		</view>
		<view v-if="lists.length>0" class="data-list" v-for="(item,index) in lists" :key="index">
			<view class="data-list-left">
				<view class="data-img">
					<image :src="item.image"></image>
				</view>
				<view class="data-title">
					 
					<view class="data-title0">{{item.shop_name}}</view>
					<view class="data-title01">{{item.award_name}}</view>
					<view class="data-title1"> 一个优惠券仅可使用一次，不得转让</view>
					<view v-if="item.status==0" class="" style="font-size: 12px;margin-top: 20upx;color: green;">未核销 </view>
					<view v-if="item.status==1" class="" style="font-size: 12px;margin-top: 20upx;color: #999;">已核销 </view>
					<view v-if="item.status==2" class="" style="font-size: 12px;margin-top: 20upx;color: #999;">已过期 </view>
				</view>
			</view>
			<view class="data-look" @click="lookDetail(item.id)">
				<view class="" style="width: 30px;">查看 </view>
				<view class="" style="width: 30px;">明细 </view>
				 
			</view>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				lists:[],
				// g: require('../../static/event/lucky/draw.png')
			}
		},

		onLaunch: function() {
			console.log('App Launch')
		},

		onLoad: function() {
			 this.getList()
		},
		onHide: function() {

		},
		methods: {
			 
			  getList() { 
			const t = uni.getStorageSync('storage_user');
				this.$Z.post(t.reqUrl + "/activity/awardList", {
					page: 1,
					rows:1000,
					token:t.token
				}, {
					native: false
				}).then(res => {
					this.lists = res.data.data;
			
			
			
				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},
			lookDetail(id) {
				uni.navigateTo({
					url: "/pages/game/detail?id="+id
				})
			}

		}
	}
</script>

<style scoped>
	.lists-title {
		padding: 40upx 0;
		text-align: center;
		background-color: #f6bb21;
		font-size: 40upx;
	}

	.lists {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.data-list {
		width: 80%;
		padding: 30upx;
		margin: 0 auto;
		margin-top: 40upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 16upx;
	}
		
    .wujilv{
		margin-top: 30%;
		font-size: 30upx;
		color: #999;
		text-align: center;
	}
	.data-list-left {
		display: flex;
		flex-direction: row;
		align-items: center;

	}

	.data-title {
		margin-left: 40upx;
	}

	.data-title0 {
		font-size: 30upx;
		font-weight: bold;

	}
	.data-title01 {
		font-size: 30upx; 
	
	}

	.data-title1 {
		margin-top: 20upx;
		font-size: 12px;
		color: #333
	}

	.data-img {
		width: 120upx;
		height: 80upx;
	}

	.data-img image {
		width: 100%;
		height: 100%;
	}

	.data-look {
		font-size: 28upx;
		border-left: 1px solid #999;
		padding: 0 40upx;
	}
</style>
