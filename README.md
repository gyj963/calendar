Calendar - 一个自制的移动web日历组件
==============================
##功能介绍
手机效果截图（Android）：

*	滑动日历组件的日期部分可以切换上下月（向右滑：上个月，向左滑：下个月）
![calendar](screenshot/1.jpg)


*	长按年月（截图中相应为【2014年7月】）可以跳转日期，上下滑动选择年和月。
![calendar](screenshot/2.jpg)

*	如果需要，你可以自己编辑点击一个日期，执行的响应函数。
![calendar](screenshot/3.jpg)




##  查看效果
下载代码，在此文件夹中命令行输入命令：

*   npm install

来安装必要的module


*   node app.js

启动服务器

*   在浏览器中输入 localhost:3000

查看组件效果

可使用电脑或移动设备进行查看~

*   电脑浏览器查看请启用google的Emulate touch screen
*   移动设备需链接您的电脑


##  组件的使用
index.js即使用示例

详细说明：
引用public文件夹下javascript（除index.js外）及stylesheets中文件
在html文件中创建一个div并给其定义id（名字自定义），作为日历组件的容器，例如：
```{bash}
<div id="container">
</div>
```


接下来就可以调用相册组件啦，例如：
```{bash}
new PhotoAlbum({
	               "containerId":"container",   //   相册组件容器的id
	               "list":photolist,   //   图片路径对象列表
				   "size":120   //每个正方形缩略图的边长(单位：px)，可省（默认边长：100px）
               });
new Calendar({
	//   日历组件容器的id
	containerId:"container", 
	//   点击一个日期，执行的响应函数，可省
	selectDate:function(data){
		var year=data.year;
		var month=data.month;
		var date=data.date;
		alert(year+" 年 "+month+" 月 "+date+" 日");
	}
});
```





