<template>
	<view class="backgroundColorLine">
		<image :src="lanya" class="lanyastyle"></image>
		<!-- <button type="primary" @click="startBluetoothDeviceDiscovery">搜索蓝牙</button>
		<button type="primary" @click="onBluetoothDeviceFound">发现外围设备</button>
		<button type="primary" @click="getBluetoothDevices">获取蓝牙设备信息</button>
		<button type="primary" @click="getBLEDeviceServices">获取蓝牙所有服务</button>
		<button type="primary" @click="getBLEDeviceCharacteristics">进入特征</button> -->


		<view class="backgroundColorLineText" v-if="!showButton">
			蓝牙连接中,请稍等
		</view>

		<view class="backgroundColorLineSuccess" v-if="showButton">
			{{ list[0].name}} 连接成功

		</view>


		<!-- <view class="writeStyle" v-if="showButton">
			<button type="primary" class="writeStyle12"  @click="handleOpenBluetoothAdapter">重试</button>
			<button type="primary"  class="writeStyle12" @click="handleInToPay">支付费用</button>
		</view> -->
		<view class="writeStyle" v-if="showButton">

			<button v-else open-type="getPhoneNumber" v-if="!getUserInfoDataToken" class="chexiao" @click.stop="loginfn"
				@getphonenumber.stop="onGetPhoneNumber"> 手机号授权</button>
			<button type="primary" class="writeStyle12" v-if="getUserInfoDataToken"
				@click="createorder('PBSS',1)">开一盒</button>
			<button type="primary" class="writeStyle12" v-if="getUserInfoDataToken"
				@click="createorder('PASS',2)">开二盒</button>
		</view>





		<!-- 	<view class="writeStyle">
			<button type="primary" class="bgColor" @click="handleOpenBluetoothAdapter">重试</button>
			<button type="primary" @click="createBLEConnection(item.deviceId)">连接</button>
			<button type="primary" @click="stopBluetoothDevicesDiscovery">停止搜索蓝牙</button>
		</view> -->
		<view class="huanxing" @click="writeBLECharacteristicValue('PCSS')">激活机身</view>
		<!-- <view class="huanxing" @click="writeBLECharacteristicValue('PCSS')">激活机身</view> -->
	</view>
</template>

<script>
	import QQMapWX from '../../utils/qqmap-wx-jssdk.js'
	var qqmapsdk;
	export default {
		data() {
			return {
				showButton: false,
				duration: 5000,
				list: [],
				deviceId: '',
				serviceId: '',
				characteristics: [],
				characteristicId: '',
				lanya: require('../../static/img/lanya.jpg'),
				getUserInfo: {},
				getUserInfoDataToken: false,
				code: "",
				address:"",
				positionInfo: {
					address: "",
					longitude: "",
					latitude: "",
				}
			}
		},
		onLoad() {
			const that = this 
			console.log('纬度' )
			var QQMapWX = require('../../utils/qqmap-wx-jssdk')
			var qqmapsdk = new QQMapWX({
				key: 'OB7BZ-S6FWT-GOBXR-LONYL-GKEE5-OTBRD' // 必填
			})
			// https://blog.csdn.net/weixin_62353876/article/details/126779189
			wx.getLocation({
				type: 'wgs84',
				success(res) {
					console.log('纬度', res)
					wx.setStorageSync('latitude', res.latitude)
					wx.setStorageSync('longitude', res.longitude)
				},
				//wx.getLocation  回调里面把上面获取到的经纬度给引入的qqmap-wx-jssdk就可以获取到对应的地点了
				complete() {
					// 坐标转换
					qqmapsdk.reverseGeocoder({
						// 位置坐标，默认获取当前位置，非必须参数
						location: {
							latitude: wx.getStorageSync('latitude'),
							longitude: wx.getStorageSync('longitude')
						},
						success: function(res) {
							console.log(11, res.result.address_component.city)
							that.address = res.result.address_component.city
							console.log(22, that.address)
							wx.setStorageSync('address_component', res.result.address_component.city)
						},
						fail: function(error) {
							console.error('错误了', error)
						}
					})
				}
			})
		
		// this.getCurrentLocation()	
		// uni.chooseLocation({
		// 								success: (res) => {
		// 									console.log('位置名称：' + res.name);
		// 									console.log('详细地址：' + res.address);
		// 									console.log('纬度：' + res.latitude);
		// 									console.log('经度：' + res.longitude);
		// 								}
		// 							})
	},

	onShow() {
			// this.getCurrentLocation()
			this.handleOpenBluetoothAdapter();
			let users = uni.getStorageSync('usersInfo');
			if (users) {
				this.getUserInfo = JSON.parse(users);
				if (this.getUserInfo.data && this.getUserInfo.data.userinfo) {
					this.getUserInfoDataToken = this.getUserInfo.data.userinfo ? true : false
				}
			}
		},
		methods: {
			getCurrentLocation() {
				let that = this //在uniapp中药定义一下this才能使用
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						console.log('===8888====>', res);
						that.positionInfo.longitude = res.longitude;
						that.positionInfo.latitude = res.latitude;
						that.loAcquire(that.positionInfo.longitude, that.positionInfo.latitude)

					}
				});
			},
			// 获取当前地址
			loAcquire(longitude, latitude) {
				let that = this;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let str = `output=jsonp&key='OB7BZ-S6FWT-GOBXR-LONYL-GKEE5-OTBRD'=${latitude},${longitude}` //记得在这里要输入密钥哦！
				this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/?' + str, {}).then(res => {
					console.log(res);
					uni.hideLoading();
					if (res.status == 0) {
						that.positionInfo.address = '当前位置是:' + res.result.address_component.street_number; //当前定位
						console.log('===9999====>', that.positionInfo);
					}
				})
			},
			//0000000000000000000000000
			// 用户授权登录
			//首先点击登录按钮的时候获取一下code，保存到data里
			loginfn() {
				let that = this;
				wx.login({
					success(res) {
						that.code = res.code;
						return;
					},
				});
			},
			//调用button自带的弹窗获取用户信息方法
			async onGetPhoneNumber(val) {
				//此时的val是用户点击了允许还是拒绝
				let that = this;
				if (val.detail.errMsg === "getPhoneNumber:ok") {

					//保存需要的** iv, encryptedData **
					const {
						iv,
						encryptedData
					} = val.detail;
					that.getawardDetail(that.code, encryptedData, iv)


				}
			},
			getawardDetail(code, encryptedData, iv) {
				uni.request({
					url: 'http://ys.shningmi.com/api/login/login',
					data: { //参数
						code,
						encryptedData,
						iv
					},
					header: {
						// 'Content-Type': 'application/x-www-form-urlencoded'
						'Content-Type': 'application/json' //自定义请求头信息
					},
					method: 'POST', //请求方式，必须为大写
					success: (res) => {
						let {
							data
						} = res;
						uni.setStorageSync('usersInfo', JSON.stringify(data));
						this.getUserInfo = JSON.parse(uni.getStorageSync('usersInfo'));

						console.log('缓存数据--1----', this.getUserInfo.data);

						if (this.getUserInfo.data && this.getUserInfo.data.userinfo) {
							console.log('缓存数据--2----', this.getUserInfo.data.userinfo);
							this.getUserInfoDataToken = this.getUserInfo.data.userinfo ? true : false
						}



					}
				})

			},
			//0000000000000000000000000



			// 手动连接蓝牙
			handleOpenBluetoothAdapter() {
				uni.openBluetoothAdapter({
					success: (res) => { //已打开
						uni.getBluetoothAdapterState({ //蓝牙的匹配状态
							success: (res1) => {
								console.log(res1, '本机设备的蓝牙已打开')
								// 开始搜索蓝牙设备
								this.startBluetoothDeviceDiscovery()
							},
							fail(error) {
								uni.showToast({
									icon: 'none',
									duration: this.duration,
									title: '查看手机蓝牙是否打开'
								});
							}
						});

					},
					fail: err => { //未打开 
						uni.showToast({
							icon: 'none',
							duration: this.duration,
							title: '查看手机蓝牙是否打开'
						});
					}
				})
			},
			// 开始搜索蓝牙设备
			startBluetoothDeviceDiscovery() {
				uni.startBluetoothDevicesDiscovery({
					success: (res) => {
						console.log('startBluetoothDevicesDiscovery success', res)
						// 发现外围设备
						this.onBluetoothDeviceFound()
					},
					fail: err => {
						console.log(err, '错误信息')
					}
				})
			},
			// 发现外围设备
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {

					if (this.list.indexOf(res.devices[0].deviceId) == -1) {
						if (res.devices[0].name.slice(0, 4) === 'WMD8') {
							this.createBLEConnection(res.devices[0].deviceId)
							this.list.push({
								name: res.devices[0].name,
								deviceId: res.devices[0].deviceId
							})
							// console.log('----this.list------', this.list)
						}

					}
				})
			},
			//获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
			getBluetoothDevices() {
				console.log("获取蓝牙设备");
				uni.getBluetoothDevices({
					success: res => {
						console.log('获取蓝牙设备成功:');
						console.log(res.devices);
					}
				});
			},
			//选择设备连接吧deviceId传进来
			createBLEConnection(deviceId) {
				let _this = this;
				//data里面建立一个deviceId，存储起来
				this.deviceId = deviceId,
					//连接蓝牙
					uni.createBLEConnection({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: this.deviceId,
						success(res) {
							console.log("蓝牙连接成功", res);
							// 获取蓝牙服务
							_this.getBLEDeviceServices()
						},
						fail(res) {
							console.log("蓝牙连接失败", res)
						}
					})
			},
			// 停止搜寻蓝牙设备
			stopBluetoothDevicesDiscovery() {
				uni.stopBluetoothDevicesDiscovery({
					success: e => {
						this.loading = false
						console.log('停止搜索蓝牙设备:' + e.errMsg);
					},
					fail: e => {
						console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
					}
				});
			},

			//获取蓝牙特征
			getBLEDeviceCharacteristics() {
				let _this = this;
				console.log("进入特征");
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: this.deviceId,
						// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						serviceId: this.serviceId,
						success: (res) => {
							console.log('特征getBLEDeviceCharacteristics', res)
							this.characteristics = res.characteristics
							console.log('特征数组', this.characteristics)
							// "0000FFE1-0000-1000-8000-00805F9B34FB"
							res.characteristics.forEach((item) => {
								if (item.uuid.indexOf("FFE1") != -1) {
									_this.characteristicId = item.uuid
									//console.log('characteristicId:', item.uuid)
									//利用传参的形势传给下面的notify，这里的uuid如果都需要用到，就不用做判断了，建议使用setTimeout进行间隔性的调用此方法
									_this.notifyBLECharacteristicValueChange(item.uuid)
								}
							})
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}, 1000)
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange(characteristicId) {
				let _this = this;
				console.log(characteristicId, 'characteristicId')
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: this.deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: characteristicId,
					success: (res) => {
						console.log(res)
						// console.log(this.characteristicId)
						_this.listenValueChange()
						console.log('notifyBLECharacteristicValueChange success', res.errMsg)
					},
					fail: (res) => {
						console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
					}
				})
			},
			//获取蓝牙的所有服务
			getBLEDeviceServices() {
				setTimeout(() => {
					uni.getBLEDeviceServices({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: this.deviceId,
						success: (res) => {
							console.log('获取到蓝牙所有的服务:', res)
							// 0: {uuid: "0000FFE0-0000-1000-8000-00805F9B34FB", isPrimary: true}
							// 1: {uuid: "00001800-0000-1000-8000-00805F9B34FB", isPrimary: true}
							// 2: {uuid: "00001801-0000-1000-8000-00805F9B34FB", isPrimary: true}
							res.services.forEach((item) => {
								if (item.uuid.indexOf("FFE0") != -1) {
									this.serviceId = item.uuid;
									console.log("1800特征值", this.serviceId)
									//获取特征
									this.getBLEDeviceCharacteristics()
								}
							})
						}
					})
				}, 1000)
			},
			strToHexCharCode(str) {
				if (str === "")
					return "";
				var hexCharCode = [];
				hexCharCode.push("0x");
				for (var i = 0; i < str.length; i++) {
					hexCharCode.push((str.charCodeAt(i)).toString(16));
				}
				return hexCharCode.join("");
			},
			handleInToPay() {
				let params = {
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					unids: this.list[0].name.slice(4),
					characteristicId: this.characteristicId
				};
				let param = JSON.stringify(params)
				uni.navigateTo({
					url: '/pages/game/detail?param=' + param
				})
			},
			//写入蓝牙 这页面传入PCSS是唤醒功能
			async writeBLECharacteristicValue(v) {
				console.log('这页面传入PCSS是唤醒功能', v);
				console.log('这页面传入PCSS是唤醒功能1', this.deviceId);
				console.log('这页面传入PCSS是唤醒功能2', this.serviceId);
				console.log('这页面传入PCSS是唤醒功能3', this.characteristicId);
				let unids = this.list[0].name.slice(4)
				//PASS PBSS
				let msg = v + unids;
				const buffer = new ArrayBuffer(msg.length);
				const dataView = new DataView(buffer);
				for (var i = 0; i < msg.length; i++) {
					dataView.setUint8(i, msg.charAt(i).charCodeAt())
				}
				let resHex = this.ab2hex(buffer) + "0D0A";


				var buffers = new Uint8Array(resHex.match(/[\da-f]{2}/gi).map(function(h) {
					return parseInt(h, 16)
				})).buffer
				console.log('这页面传入PCSS是唤醒功能3buffers', buffers);
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffers,
					success(res) {
						console.log('写入成功', res);
						uni.showToast({
							icon: 'none',
							title: "开启成功"
						})
					},
					fail(res) {
						console.log('写入失败1', JSON.stringify(res))
						// console.log('写入失败2', JSON.stringify(buffer))
					}
				})
			},


			// 88888888888

			//字符串转arraybuffer

			string2buffer(str) {

				// 首先将字符串转为16进制

				let val = ""

				for (let i = 0; i < str.length; i++) {

					if (val === '') {

						val = str.charCodeAt(i).toString(16)

					} else {

						val += ',' + str.charCodeAt(i).toString(16)

					}

				}
				console.log('16数据', val)
				// console.log(val)

				// 将16进制转化为ArrayBuffer

				return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function(h) {

					return parseInt(h, 16)

				})).buffer



			},
			str2ab(str) {
				const buffer = new ArrayBuffer(str.length / 2);
				let x = new Uint8Array(buffer);
				for (let i = 0; i < x.length; i++) {
					x[i] = parseInt(str.substr(2 * i, 2), 16)
				}
				return buffer;
			},
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return (bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			},

			// 将16进制的内容转成我们看得懂的字符串内容
			hexCharCodeToStr(hexCharCodeStr) {
				var trimedStr = hexCharCodeStr.trim();
				var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
				var len = rawStr.length;
				if (len % 2 !== 0) {
					alert("存在非法字符!");
					return "";
				}
				var curCharCode;
				var resultStr = [];
				for (var i = 0; i < len; i = i + 2) {
					curCharCode = parseInt(rawStr.substr(i, 2), 16);
					resultStr.push(String.fromCharCode(curCharCode));
				}
				return resultStr.join("");
			},

			// 【9】监听消息变化
			listenValueChange() {
				let _this = this;
				console.log("进去了吗")
				_this.showButton = true
				uni.onBLECharacteristicValueChange(res => {
					// 结果
					console.log('进去了吗1111', res)

					// 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
					let resHex = _this.ab2hex(res.value)
					console.log(resHex)

					// 最后将16进制转换为ascii码，就能看到对应的结果
					let result = _this.hexCharCodeToStr(resHex)
					console.log('最终结果', result)
				})
			},
			// 创建订单
			async createorder(v, numV) {
				let _this = this;
				await uni.request({
					url: 'http://ys.shningmi.com/api/order/create',
					data: {
						guid: "guid",
						qty: numV
					},
					header: {
						// 'Content-Type': 'application/x-www-form-urlencoded'
						'Content-Type': 'application/json',
						'token': this.getUserInfo.data.token
					},
					method: 'POST', //请求方式，必须为大写
					success: (res) => {
						// _this.writeBLECharacteristicValue(v);
						uni.requestPayment({
							provider: 'wxpay', // 服务提提供商
							timeStamp: res.data.data.timeStamp, // 时间戳
							nonceStr: res.data.data.nonceStr, // 随机字符串
							package: res.data.data.package,
							signType: res.data.data.signType, // 签名算法
							paySign: res.data.data.sign, // 签名
							success: function(res) {
								console.log('支付成功', res);
								_this.writeBLECharacteristicValue(v)


							},
							fail: function(err) {
								console.log('支付失败', err);
							}
						});

					}
				})

			},
			// 8888888888

			// 获取当前位置

			// 当前位置
		}
	}
</script>

<style scoped>
	.backgroundColorLine {
		background: linear-gradient(180deg, #4E85FD 0%, #84BBFF 100%);
		min-height: 100vh;
	}

	.lanyastyle {
		width: 500upx;
		height: 500upx;
		margin: 0 auto;
		display: flex;
		padding-top: 47%;
	}

	.backgroundColorLineText {
		color: #fff;
		text-align: center;
		font-size: 14px;
		margin-top: 50upx;
	}

	.backgroundColorLineSuccess {
		color: #fff;
		text-align: center;
		font-size: 14px;
		margin-top: 50upx;
	}

	.writeStyle {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: 50px;
	}

	.bgColor {
		width: 60%;
		background-color: #fff;
		border: none;
		outline: none;
		color: #e4393c;
		font-size: 26upx;
	}

	.writeStyle12 {
		font-size: 28upx;
	}

	.huanxing {
		position: fixed;
		right: 30upx;
		bottom: 50upx;
		/* width: 100upx; */
		/* height: 100upx; */
		/* line-height: 100upx; */
		text-align: center;
		border-radius: 50upx;
		background-color: #fff;
		color: #4E85FD;
		font-size: 12px;
		padding: 10px;
	}
</style>