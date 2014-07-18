/**
 * Created by Administrator on 14-7-15.
 */
new Calendar({
	containerId:"container",
	selectDate:function(data){
		var year=data.year;
		var month=data.month;
		var date=data.date;
		alert(year+" 年 "+month+" 月 "+date+" 日");
	}
});

