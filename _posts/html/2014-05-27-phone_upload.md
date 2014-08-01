---
layout: post
title:  "手机上传图片问题小结2"
keywords: work, imgupload, img, upload
---

#手机上传图片问题小结2
早上碰到一个手机上打不开上传控件的问题，具体表现为，android无法打开文件上传控件而ios正常，之前的上传方案是:

	<form style="display:none">
		<input type="file" id="upload">
	</form>

通过点击页面上的Element#elem，trigger#upload的click事件来调起控件
	
	$("#elem").click(function(){
		 $("#upload").trigger("click");
	})

推测可能原因有两个，1) trigger方法在android上不生效，2) android不支持file控件.

##模拟环境查原因
构造静态页

	<form>
		<input type="file" id="upload">
	</form>

使用问题android打开，在原生的android浏览器中，可以打开文件控件，否定第二个原因.
增加js，添加jquery，绑定事件

	$("#elem").click(function(){
		 $("#upload").trigger("click");
	})

也可以调起文件控件，不解，再次操控原始html，设置form的display:none, 无法调起控件，至此大致明白了因果。
android手机浏览器应该是在display:none的element上做了不同于PC的特殊渲染处理，导致file无法被获取，固无法调起file控件.

##解决方案
将form设置不可见，但是不能设置display:none

		<form style="visibility:hidden;width:0;height:0;overflow:hidden">
			<input type="file" id="upload">
		</form>
上传demo，手机打开页面，ok，问题解决了.

##总结
手机浏览器和PC浏览器还是有较多差异，需要耐心测试才能找到问题的根本原因. 
