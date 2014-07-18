/**
 * Created by Administrator on 14-7-15.
 */
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

