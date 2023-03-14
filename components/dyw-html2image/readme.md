# html2canvas

### 使用方法

```
	import htmlToCavas from '@/components/html2image/html2image'
	
	htmlToCavas(element, {
						useCORS: true,
						logging: true, 
						backgroundColor: '#982121', 
						scale: 2, 
						dpi: 350}).then(res=> {
						this.imageSrc = res.src
					}).catch(err=> {
						console.log(err)
					})
```

