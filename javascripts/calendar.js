/**
 * Created by Administrator on 14-7-15.
 */
function Calendar(opt){
	this._container=document.getElementById(opt.containerId);
	this._selectDateEvent=opt.selectDate;
	this.init();
	this.renderDOM();
	this.bindDOM();
	this._selectDateEvent&&this.selectDateEvent();
}
Calendar.prototype.init=function(){
	this._calendarWrap = document.createElement("div");
	this._calendarWrap.id = "calendar";
	this._table=document.createElement("table");
	this._caption=document.createElement("caption");

	this.time={};
	this.time.Date=new Date(); //	获取当前日期
	this.time.year=this.time.Date.getFullYear();  //	获取当前年份
	this.time.month=this.time.Date.getMonth()+1;  //	获取当前月份 (打印发现当前月份为 7  打印出来为 6)
	this.time.date=this.time.Date.getDate();  //	获取当前日（一个月中）
	this.time.day=this.time.Date.getDay();  //	获取当前是星期几


//	跳转日期组件
	this._skipObj=document.createElement("div");
	this._skipObj.id = "skipObj";
	this._skipObj.className="hide";

	this._skipShade=document.createElement("div");
	this._skipShade.id = "skip_shade";

	this._skip=document.createElement("div");
	this._skip.id = "skip";

	this._skipHeader=document.createElement("div");
	this._skipHeader.className = "skip_header";
	this._skipHeader.innerHTML="跳转日期";

	this._skipWrap=document.createElement("div");
	this._skipWrap.className = "skip_wrap";

	this._skipYear=document.createElement("div");
	this._skipYear.id = "skip_year";
	this._skipYearUl=document.createElement("ul");
	this._skipYearUl.id = "skip_year_ul";
	this._skipYear.appendChild(this._skipYearUl);

	this._skipMonth=document.createElement("div");
	this._skipMonth.id = "skip_month";
	this._skipMonthUl=document.createElement("ul");
	this._skipMonthUl.id = "skip_month_ul";
	this._skipMonth.appendChild(this._skipMonthUl);

	this._skipSelect=document.createElement("div");
	this._skipSelect.className = "skip_select";
	this._skipSelectYear=document.createElement("span");
	this._skipSelectYear.className="year";
	this._skipSelectYear.innerHTML="年";
	this._skipSelectMonth=document.createElement("span");
	this._skipSelectMonth.className="month";
	this._skipSelectMonth.innerHTML="月";
	this._skipSelect.appendChild(this._skipSelectYear);
	this._skipSelect.appendChild(this._skipSelectMonth);

	this._skipWrap.appendChild(this._skipYear);
	this._skipWrap.appendChild(this._skipMonth);
	this._skipWrap.appendChild(this._skipSelect);

	this._skipEvent=document.createElement("div");
	this._skipEvent.className = "skip_event";
	this._skipEventCancel=document.createElement("div");
	this._skipEventCancel.className="skip_cancel";
	this._skipEventCancel.innerHTML="取消";
	this._skipEventGo=document.createElement("div");
	this._skipEventGo.className="skip_go";
	this._skipEventGo.innerHTML="跳转";
	this._skipEvent.appendChild(this._skipEventCancel);
	this._skipEvent.appendChild(this._skipEventGo);

	this._skip.appendChild(this._skipHeader);
	this._skip.appendChild(this._skipWrap);
	this._skip.appendChild(this._skipEvent);

	this._skipObj.appendChild(this._skipShade);
	this._skipObj.appendChild(this._skip);
	this._calendarWrap.appendChild(this._skipObj);

	fillSkipUl(this.time.year,this._skipYearUl);
	fillSkipUl(this.time.month,this._skipMonthUl);
};


//创建每个月的表格内容
Calendar.prototype.createMonContent=function(opt){
	var monTbody=document.createElement("tbody");
	monTbody.setAttribute("class",opt.classObj);
	var weekIndex=0;
	var ContentString="<tr>";
	var todayInCurMon=false;
	var tmpContentString="";


	for(var i = opt.curObj.dayOfMonBegin-1;i>=0;i--){
		 tmpContentString="<td class='notCurMon last'>"+(opt.lastObj.daysOfMon-i)+"</td>";
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
			tmpContentString="<td class='notCurMon next'>"+k+"</td>";
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
		}else if(opt === "getCur"){
			return{
				year:parseInt(curYear),
				month:parseInt(curMonth)
			};
		}
	}else{
		year=opt.getFullYear();
		month=opt.getMonth();
		month+=1;
	}

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
	var that=this,
//		跳转日期变量
		startY="",
		pathY="",
		offsetY="",
		endY="",
		liY=30,
		startHideCount= 0,
		year=this._skipYear,
		yearUl=this._skipYearUl,
		month=this._skipMonth,
		monthUl=this._skipMonthUl,
		eventCancel=this._skipEventCancel,
		eventGo=this._skipEventGo,
		tmpCreateTop= 0,
		tmpCreateBottom=0;

	$(".curMon").show();
	$("body").on("swipeRight","tbody",function(){
		var $lastMon= $(".lastMon");
		$lastMon.removeClass("animated fadeInRight fadeInLeft");
		$lastMon.addClass("animated fadeInLeft");
		$(this).hide();
		$lastMon.show();
		$lastMon[0].addEventListener("webkitAnimationEnd",function(){
			$lastMon.removeClass("animated fadeInLeft");
			$lastMon[0].removeEventListener("webkitAnimationEnd");
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
	        $nextMon[0].removeEventListener("webkitAnimationEnd");
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
	});


//  跳转日期事件绑定
	function touchstartHandler(e){
		startY=e.touches[0].pageY;
		if(startY===""){
			startY+=startHideCount*liY;
		}
		tmpCreateTop=0;
		tmpCreateBottom=0;
	}
	function touchmoveHandler(e,obj,type){
		e.preventDefault();
		pathY=e.touches[0].pageY;
		offsetY=pathY-startY;
//		touchmove中将动态创建的li 起始为0；向下滑动超过30px则创建元素 创建li个数为offsetY/30
		if(offsetY>0){
			while(tmpCreateTop<offsetY/30){
				var nowFirstLiContent=$(obj).children().first().html(),
					tmpli=document.createElement("li");
				if(type==="month"&&parseInt(nowFirstLiContent)-1===0){
					tmpli.innerHTML=12;
				}else{
					tmpli.innerHTML=parseInt(nowFirstLiContent)-1;
				}
				startHideCount+=1;
				tmpli.style.cssText="-webkit-transform:translate3d(0,"+(offsetY+startHideCount*liY)+"px,0)";
				obj.insertBefore(tmpli, obj.firstChild);
				tmpCreateTop+=1;
				$(obj).children().last().remove();
			}
		}else{
			while(tmpCreateBottom<(-offsetY/45)){
				var nowLastLiContent=$(obj).children().last().html(),
					tmpli=document.createElement("li");
				if(type==="month"&&parseInt(nowLastLiContent)+1===13){
					tmpli.innerHTML=1;
				}else{
					tmpli.innerHTML=parseInt(nowLastLiContent)+1;
				}
				startHideCount-=1;
				tmpli.style.cssText="-webkit-transform:translate3d(0,"+(offsetY+startHideCount*liY)+"px,0)";
				obj.appendChild(tmpli);
				tmpCreateBottom+=1;
				$(obj).children().first().remove();
			}
		}
		var lis=$(obj).children();
		for(var i = 0,len=lis.length;i<len;i++){
			lis.eq(i)[0].style.cssText="-webkit-transform:translate3d(0,"+(offsetY+(tmpCreateBottom-tmpCreateTop)*liY)+"px,0)";
		}
		$(obj).find(".selected").removeClass("selected");
	}
	function touchendHandler(e,obj){
		endY=e.changedTouches[0].pageY;
		offsetY=endY-startY;
		$(obj).children().eq(2).addClass("selected");
		var lis=$(obj).children();
		for(var i = 0,len=lis.length;i<len;i++){
			lis.eq(i)[0].style.cssText="-webkit-transform:translate3d(0,0,0)";
		}
	}
	addListener(year, "touchstart",function(e){
		touchstartHandler(e);
	});
	addListener(year, "touchmove",function(e){
		touchmoveHandler(e, yearUl,"year");
	});
	addListener(year, "touchend",function(e){
		touchendHandler(e,yearUl);
	});
	addListener(month, "touchstart",function(e){
		touchstartHandler(e);
	});
	addListener(month, "touchmove",function(e){
		touchmoveHandler(e, monthUl,"month");
	});
	addListener(month, "touchend",function(e){
		touchendHandler(e,monthUl);
	});

	addListener(eventCancel, "touchstart",function(e){
		$(eventCancel).addClass("yes");
	});
	addListener(eventCancel, "touchend",function(e){
		$(eventCancel).removeClass("yes");
		that._skipObj.className="hide";
	});

	addListener(eventGo, "touchstart",function(e){
		$(eventGo).addClass("yes");
	});
	addListener(eventGo, "touchend",function(e){
		$(eventGo).removeClass("yes");
		var skipObj={
			year : parseInt($("#skip_year_ul>.selected").html()),
			month: parseInt($("#skip_month_ul>.selected").html())
		};
		var skipTo=generateMonObj(skipObj);
		that.createCaption(skipTo);
		that.monthes=getMonthes();
		$(".monBlock").remove();
		that.createMonBody();
		$(".curMon").show();
//		渐隐
		fade(that._skipObj,"hiden",function(){
			that._skipObj.className="hide";
			that._skipObj.style.opacity=1;
		});
	});

	$(that._caption).on("longTap",function(){
		that._skipObj.className="";
		var curTime=that.createCaption("getCur");
		fillSkipUl(parseInt(curTime.year),that._skipYearUl);
		fillSkipUl(parseInt(curTime.month),that._skipMonthUl);
	});
};
Calendar.prototype.selectDateEvent=function(){
	var that=this;
	$("body").on("tap","tbody.monBlock td",function(){
		var curTime=that.createCaption("getCur");
		var thisDate = parseInt($(this).html());
		if($(this).hasClass("notCurMon")){
			if($(this).hasClass("last")){
				if(curTime.month-1===0){
					curTime.month=12;
					curTime.year-=1;
				}else{
					curTime.month-=1;
				}

			}else if($(this).hasClass("next")){
				if(curTime.month+1===13){
					curTime.month=1;
					curTime.year+=1;
				}else{
					curTime.month+=1;
				}
			}
		}
		curTime.date = thisDate;
		console.log("curTime :",curTime);
		that._selectDateEvent.call(undefined,curTime);
	});
};

function fillSkipUl(time,obj){
	obj.innerHTML="";
	for(var i = time-2;i<=time+2;i++){
		var skipYearLi=document.createElement("li");
		skipYearLi.innerHTML=i;
		obj.appendChild(skipYearLi);
	}
	$(obj).children().eq(2).addClass("selected");
}

function getDaysOfMonth(date){
	return new Date(date.getFullYear(), (date.getMonth()+1), 0).getDate();
}
function generateMonObj(opt){
	return new Date(opt.month+",1,"+opt.year);
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
	};
}

function addListener(target, type, handler){
	if(target.addEventListener){
		target.addEventListener(type, handler, false);
	}else if(target.attachEvent){
		target.attachEvent("on" + type, handler);
	}else{
		target["on" + type] = handler;
	}
}

//渐显渐隐函数
function fade(obj,method,callback){ //method有两个值show或hiden callback函数为渐显渐隐结束后的回调函数，若无可省
	var n = (method == "show") ? 0 : 100,
		ie = (window.ActiveXObject) ? true : false;
	var time = setInterval(function(){
		if(method == "show"){
			if(n < 100){
				n+=10;
				if(ie){
					obj.style.cssText = "filter:alpha(opacity="+n+")";
				}else{
					(n==100) ? obj.style.opacity = 1 : obj.style.opacity = "0."+n;
				}
			}else{
				clearTimeout(time);
				callback&&callback();
			}
		}else{
			if(n > 0){
				n-=10;
				if(ie){
					obj.style.cssText = "filter:alpha(opacity="+n+")";
				}else{
					obj.style.opacity = "0."+n;
				}
			}else{
				clearTimeout(time);
				callback&&callback();
			}
		}
	},30);
}


