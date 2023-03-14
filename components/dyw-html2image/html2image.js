import html2canvas from '@/components/dyw-html2image/html2canvas.min.js'
import canvas2Image from '@/components/dyw-html2image/canvas2image.js' // canvas源码不支持import导入，在源码的最后添加export default使得可以将canvas2image对象import进来

/**
 * html2image: 将canvas2iamge以及html2canvas结合，将html转化为image. 方便大家使用，也可以自己去下载这两个插件，单独使用。
 * @param {Object} element : html元素，如document.body, document.getElementById('elementId')
 * @param {Object} html2canvasObject : html2canvas所需要的参数， 具体参数可访问html2canvas网站： http://html2canvas.hertzen.com/configuration
 * @param {String} saveType :'download'和'src'两种类型，第一种直接下载（微信中不可直接下载，被拦截）第二种返回src,可放入image标签中使用    canvas转image:  git地址： https://github.com/hongru/canvas2image
 * @param {String} imageName : 导出的图片命名, 只有type为'download'才会生效
 * @param {String}  type: 图片的类型： png， jpeg，gif，bmp，四种类型
 * **/
 var htmlToCavas =  function(element, html2canvasObject, saveType='src', type='png', imageName) {
	 var result = new Promise(function(resolve, reject){
		 html2canvas(element, html2canvasObject).then(canvas => {
		 									   var imageWidth = canvas.width
		 									   var imageHeight = canvas.height
											   console.log(canvas.toDataURL('image/jpeg'))
											   console.log('测试')
		 									   if(saveType=== 'download'){
		 										   canvas2Image.saveAsImage(canvas, imageWidth, imageHeight, imageName, type)
													resolve()
											   } else if(saveType === 'src'){
		 										   var result = canvas2Image.convertToImage(canvas, imageWidth, imageHeight,type)
		 										   console.log(result)
												   resolve(result)
		 									   }	   
		 }).catch(err=> {
			 reject(err)
		 })
	 })
	return result
 }
 
export default htmlToCavas