/**
 * Created by Administrator on 14-7-15.
 */
function Calendar(opt){
	this._container=document.getElementById(opt.containerId);
	this.init();
	this.renderDOM();
	this.bindDOM();
}

Calendar.prototype.init=function(){
	this._calendarWrap = document.createElement("div");
	this._calendarWrap.id = "calendar";
	this._table=document.createElement("table");
	this._caption=document.createElement("caption");
	//	获取当前日期
	this.time={};
	this.time.Date=new Date();
//	获取当前年份
	this.time.year=this.time.Date.getFullYear();
//	获取当前月份 (打印发现当前月份为 7  打印出来为 6)
	this.time.month=this.time.Date.getMonth()+1;
//	获取当前日（一个月中）
	this.time.date=this.time.Date.getDate();
//	获取当前是星期几
	this.time.day=this.time.Date.getDay();

	console.log(this.time);
};

function getDaysOfMonth(date){
	return new Date(date.getFullYear(), (date.getMonth()+1), 0).getDate();
}
function getMonAttr(opt){
//	构造月份的date对象
	opt.Date=new Date(opt.month+",1,"+opt.year);
//	月份1号是星期几
	opt.dayOfMonBegin=opt.Date.getDay();
//	获取月份有多少天
	opt.daysOfMon=getDaysOfMonth(opt.Date);
//	月份最后一天是星期几
	opt.dayOfMonEnd=new Date(opt.month+","+opt.daysOfMon+","+opt.year);
}

function getMonthes(){
	var cur={};     //	这个月
	var last={};    //	上个月
	var beforeLast={};
	var next={};    //	下个月

//	这个月 cur ---- begin
//	表格头部正显示的年
	cur.year=document.getElementById("curYear").innerHTML;
//	表格头部正显示的月
	cur.month=document.getElementById("curMonth").innerHTML;
//	获取这个月 各种属性
	getMonAttr(cur);
//	这个月 cur ---- end

//  上个月 last ---- begin
	if(parseInt(cur.month)===1){
		last.year=parseInt(cur.year)-1;
		last.month=12;
	}else{
		last.year=cur.year;
		last.month=parseInt(cur.month)-1;
	}
//	获取上个月 各种属性
	getMonAttr(last);
//  上个月 last ---- end

//	上个月的前一个月 beforeLast ---- begin
	if(parseInt(last.month)===1){
		beforeLast.year=parseInt(last.year)-1;
		beforeLast.month=12;
	}else{
		beforeLast.year=last.year;
		beforeLast.month=parseInt(last.month)-1;
	}
	getMonAttr(beforeLast);
//  上个月的前一个月 beforeLast ---- end

//  下个月 next ---- begin
	if(parseInt(cur.month)===12){
		next.year=parseInt(cur.year)+1;
		next.month=1;
	}else{
		next.year=cur.year;
		next.month=parseInt(cur.month)+1;
	}
	getMonAttr(next);
//  下个月 next ---- end

	return {
		cur :cur,
		last :last,
		beforeLast:beforeLast,
		next :next
	}
}
//创建每个月的表格内容
Calendar.prototype.createMonContent=function(opt){
	var monTbody=document.createElement("tbody");
	monTbody.setAttribute("class",opt.classObj);
	var weekIndex=0;
	var ContentString="<tr>";
	var todayInCurMon=false;
	var tmpContentString="";


	for(var i = opt.curObj.dayOfMonBegin-1;i>=0;i--){
		 tmpContentString="<td class='notCurMon'>"+(opt.lastObj.daysOfMon-i)+"</td>";
		 ContentString+=tmpContentString;
		weekIndex+=1;
	}
	if(this.time.year===parseInt(opt.curObj.year)&&this.time.month===parseInt(opt.curObj.month)){
		todayInCurMon=true;
	}
	for(var j = 1;j<=opt.curObj.daysOfMon;j++){
		if(todayInCurMon&&this.time.date===j){
			tmpContentString="<td class='today'>"+j+"</td>";
		}else{
			tmpContentString="<td>"+j+"</td>";
		}
		 ContentString+=tmpContentString;
		weekIndex+=1;
		if(weekIndex%7===0){
			weekIndex=0;
			 ContentString+="</tr>";
			if(j != opt.curObj.daysOfMon){
				 ContentString+="<tr>";
			}
		}
	}
//	如果月末没填满最后一行，就用下个月的来填
	if((opt.curObj.dayOfMonEnd+1)%7!==0){
		for(var k = 1;weekIndex%7!==0;k+=1){
			tmpContentString="<td class='notCurMon'>"+k+"</td>";
			ContentString+=tmpContentString;
			weekIndex+=1;
			if(weekIndex%7===0){
				weekIndex=0;
				 ContentString+="</tr>";
			}
		}
	}
	monTbody.innerHTML=ContentString;
	this._table.appendChild(monTbody);
};
//生成表头 显示当前正查看的年份和月份
Calendar.prototype.createCaption=function(opt){
	console.log(opt);
//	获取要显示的年份
	var year="";
//	获取要显示的月份
	var month="";
	if(typeof opt === "string"){
		//	表格头部正显示的年
		var curYear=document.getElementById("curYear").innerHTML;
		//	表格头部正显示的月
		var curMonth=document.getElementById("curMonth").innerHTML;
		if(opt ==="last"){
			if(parseInt(curMonth)===1){
				year=parseInt(curYear)-1;
				month=12;
			}else{
				year=curYear;
				month=parseInt(curMonth)-1;
			}
		}else if(opt ==="next"){
			if(parseInt(curMonth)===12){
				year=parseInt(curYear)+1;
				month=1;
			}else{
				year=curYear;
				month=parseInt(curMonth)+1;
			}
		}
	}else{
		year=opt.getFullYear();
		month=opt.getMonth();
		month+=1;
	}

	console.log("year:",year);
	console.log("month:",month);
	this._caption.innerHTML="<span id='curYear'>"+year+"</span> 年 " +
		"<span id='curMonth'>"+month+"</span> 月";
};

Calendar.prototype.createMonBody=function(){
	var monthes=this.monthes;
	var lastMon ={
		curObj : monthes.last,
		lastObj : monthes.beforeLast,
		classObj:"monBlock lastMon"
	};
	var curMon ={
		curObj : monthes.cur,
		lastObj : monthes.last,
		classObj:"monBlock curMon"
	};
	var nextMon ={
		curObj : monthes.next,
		lastObj : monthes.cur,
		classObj:"monBlock nextMon"
	};
	this.createMonContent(lastMon);
	this.createMonContent(curMon);
	this.createMonContent(nextMon);
};
Calendar.prototype.renderDOM=function(){
	var weekTbody=document.createElement("tbody");
	var weekContent='<tr class="week">' +
		'<td>SUN</td>' +
		'<td>MON</td>' +
		'<td>TUE</td>' +
		'<td>WED</td>' +
		'<td>THU</td>' +
		'<td>FRI</td>' +
		'<td>SAT</td>' +
		'</tr>';
	weekTbody.innerHTML=weekContent;
	this._table.appendChild(weekTbody);
	this.createCaption(this.time.Date);
	this._table.appendChild(this._caption);
	this._calendarWrap.appendChild(this._table);
	this._container.appendChild(this._calendarWrap);
	this.monthes=getMonthes();
	this.createMonBody();
};
Calendar.prototype.bindDOM=function(){
	var that=this;
	$(".curMon").show();
	$("body").on("swipeRight","tbody",function(){
		var $lastMon= $(".lastMon");
		$lastMon.removeClass("animated fadeInRight fadeInLeft");
		$lastMon.addClass("animated fadeInLeft");
		$(this).hide();
		$lastMon.show();
		$lastMon[0].addEventListener("webkitAnimationEnd",function(){
			$lastMon.removeClass("animated fadeInLeft");
			$lastMon[0].removeEventListener("webkitAnimationEnd")
		},false);
		$(".nextMon").remove();
		$(".curMon").addClass("nextMon").removeClass("curMon");
		$lastMon.addClass("curMon").removeClass("lastMon");
		that.createCaption("last");
		that.monthes=getMonthes();
		var lastMon ={
			curObj : that.monthes.last,
			lastObj : that.monthes.beforeLast,
			classObj:"monBlock lastMon"
		};
		that.createMonContent(lastMon);
	}).on("swipeLeft","tbody",function(){
        var $nextMon=$(".nextMon");
        $nextMon.removeClass("animated fadeInRight fadeInLeft");
        $nextMon.addClass("animated fadeInRight");
		$(this).hide();
        $nextMon.show();
        $nextMon[0].addEventListener("webkitAnimationEnd",function(){
        $nextMon.removeClass("animated fadeInRight");
        $nextMon[0].removeEventListener("webkitAnimationEnd")
	    },false);
      $(".lastMon").remove();
      $(".curMon").addClass("lastMon").removeClass("curMon");
      $nextMon.addClass("curMon").removeClass("nextMon");
      that.createCaption("next");
      that.monthes=getMonthes();
      var nextMon ={
          curObj : that.monthes.next,
          lastObj : that.monthes.cur,
          classObj:"monBlock nextMon"
      };
      that.createMonContent(nextMon);
	})
};