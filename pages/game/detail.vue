<template>
	<view class="lists">
		<view class="lists-title">
			中奖信息
		</view>
		<view class="detail-info">
			<view class="detail-info0">
				<image :src="p.image" mode=""></image>
			</view>
			<view class="detail-info1"> {{p.award_name}} </view>
			<view class="detail-info2"> 一个优惠券可以用一次，不得转让 </view>
		</view>
		
		<button v-if='p.status==0' :disabled="disabled" class="chexiao" @click="hexiao(p.id)">去核销</button>
		<button v-if='p.status==1' disabled="true" class="chexiao">已核销</button>
		<button v-if='p.status==2' disabled="true" class="chexiao">已过期</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				p:{},
				disabled: false,
				id:''
			}
		},
	 
		onLoad: function(options) {
			this.id= options.id;
            this.getawardDetail(options.id)
		},
		methods: {
			getawardDetail(id) {
			const t = uni.getStorageSync('storage_user');
				this.$Z.post(t.reqUrl + "/activity/awardDetail", {
					id, 
					token:t.token
				}, {
					native: false
				}).then(res => {
					this.p = res.data;
			
			
			
				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
				})
			},
			hexiao(id) {
				const t = uni.getStorageSync('storage_user');
				this.disabled = true;
				this.$Z.post(t.reqUrl + "/activity/checkout", {
					id, 
					token:t.token
				}, {
					native: false
				}).then(res => {
					 if(res.code==1){
						 this.getawardDetail(this.id);
						 uni.showToast({
						 	icon:'none',
							title:"核销成功"
						 })
					 }
							
							
							
				}).catch(res => {
					//异步操作失败
					// console.log(res)
				}).finally(res => {
					//异步操作完成
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

	.chexiao {
		background-color: #f6bb21;
		width: 80%;
		margin: 0 auto;
		padding: 16upx 0;
		font-size: 30upx;
	}

	.detail-info {
		padding: 100upx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.detail-info0 {
		width: 300upx;
		height: 300upx;

	}

	.detail-info0 image {
		width: 100%;
		height: 100%;
	}

	.detail-info1 {
		font-size: 50upx;
		font-weight: bold;
		margin-top: 40upx;
		margin-bottom: 20upx;
	}

	.detail-info2 {
		font-size: 28upx;
	}
</style>
