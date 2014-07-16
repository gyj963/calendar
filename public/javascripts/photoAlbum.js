/**
 * Created by Administrator on 14-7-4.
 */
function PhotoAlbum(opts){
	this._container=document.getElementById(opts.containerId);
	this._photos=opts.list;
	this._size=opts.size||100;
	//构造三部曲
	this.init();
	this.renderDOM();
	this.bindDOM();
}

PhotoAlbum.prototype.init=function()
{
	this._winW=window.innerWidth;
	this._winH=window.innerHeight;
	this._breviary=document.createElement("div");
	this._breviary.id = "breviary";
	this._large=document.createElement("div");
	this._large.id = "large";
	this._large.style.display = "none";
	this._large.setAttribute("class","animated fadeIn");
	this._largeCvs=document.createElement("canvas");
	this._largeCvs.width=this._winW;
	this._largeCvs.height=this._winH-2;
	this._largeCvsContext=this._largeCvs.getContext("2d");
	this._large.appendChild(this._largeCvs);
	this._container.appendChild(this._large);
	this._breviaryUl=document.createElement("ul");
	this._wholeCount=this._photos.length;
	this._marginBottom="5px";
};


PhotoAlbum.prototype.renderImgs_square=function(parent,thisPhoto,curphotoNo){
	var thisLiW=parent._size,         //	目前照片宽度
		minPadding= 0,       //	图片相隔最小间隙（padding）
		marginTop=parent._marginBottom,
		numOfLine=Math.floor(parent._winW/(thisLiW+minPadding)),  //	一行能放的图个数
		paddingLeft=(parent._winW-numOfLine*thisLiW)/numOfLine,   //	实际图片相隔间隙
		zoom_width=0,
		zoom_height=0;

//	如果图片宽度比高度大20%，则认为这张图是横版, 否则认为是竖版
	if(thisPhoto.width/thisPhoto.height>1.2){
//		横版图 方块风格   (缩略图默认尺寸 100[宽]*100[高] 高显示完全，以填充满整个方块)
		zoom_height=thisLiW;
		zoom_width=thisPhoto.width/thisPhoto.height*zoom_height;
	}else{
//		竖版图 方块风格   (缩略图默认尺寸 100[宽]*100[高] 宽显示完全，以填充满整个方块)
		zoom_width=thisLiW;
		zoom_height=thisPhoto.height/thisPhoto.width*zoom_width;
	}
	thisPhoto._cvs.drawImage(thisPhoto,0,0,zoom_width,zoom_height);
	thisPhoto._li.style.width=thisLiW+"px";
	thisPhoto._li.style.height=thisLiW+"px";
//	如果是每行第一个图片就不加paddingLeft 不然就要加
	if(curphotoNo%numOfLine!=1){
		thisPhoto._li.style.paddingLeft=paddingLeft+"px";
	}
	thisPhoto._li.style.marginTop=marginTop;
	thisPhoto._li.setAttribute("class","square animated bounceIn");
	parent._breviaryUl.appendChild(thisPhoto._li);
};

PhotoAlbum.prototype.renderDOM=function(){
	var parent=this,
		curphoto=0;    //	    当前是第几张图

	for(var i=0;i<parent._wholeCount;i++){
		var img=new Image();
		img.onload = function(){
			var tmpcvs=document.createElement("canvas");
			tmpcvs.id = curphoto;
			tmpcvs.setAttribute("data-src",this.src);
			tmpcvs.setAttribute("data-width",this.width);
			tmpcvs.setAttribute("data-height",this.height);
			tmpcvs.width=parent._size;
			tmpcvs.height=parent._size;
			this._li=document.createElement("li");
			this._li.appendChild(tmpcvs);
			this._cvs=tmpcvs.getContext("2d");
			curphoto+=1;
			parent.renderImgs_square(parent, this, curphoto);
		};
		img.src = this._photos[i].src;
	}
	parent._breviary.appendChild(parent._breviaryUl);
	parent._container.appendChild(parent._breviary);
};

//	        direction是显示图像来的方向
PhotoAlbum.prototype.loadImg=function(parent,_curImgId,action,callback){
	var curImgCvs=document.getElementById(_curImgId),
		ratio_img=curImgCvs.getAttribute("data-height")/curImgCvs.getAttribute("data-width"),
		ratio_win=parent._winH/parent._winW,
		largeImg=new Image(),
		paddingTop=0,
		paddingLeft=0,
		realH=0,
		realW=0;

	largeImg.onload=function(){
		switch (action){
			case "swipeLeft":
				parent._largeCvs.setAttribute("class","animated bounceInRight");
				break;
			case "swipeRight":
				parent._largeCvs.setAttribute("class","animated bounceInLeft");
				break;
			default :break;
		}
		parent._largeCvsContext.fillStyle="1F364A";//白色为例子；
		parent._largeCvsContext.fillRect(0,0,parent._winW,parent._winH);
//		ratio_img<=ratio_win则认为这是一张横版
		if(ratio_img<=ratio_win){
			realW=parent._winW;
			realH=ratio_img*realW;     //算出图片真实高度
			paddingTop=parseInt((parent._winH-realH)/2);  //算出图片上方留白
			parent._largeCvsContext.drawImage(this,0,paddingTop,realW,realH);
		}
//		ratio_img>ratio_win则认为这是一张竖版
		else if(ratio_img>ratio_win){
			realH=parent._winH;
			realW=realH/ratio_img;     //算出图片真实宽度
			paddingLeft=parseInt((parent._winW-realW)/2);  //算出图片左边留白
			parent._largeCvsContext.drawImage(this,paddingLeft,0,realW,realH);
		}
		callback&&callback();
	};
	largeImg.src = curImgCvs.getAttribute("data-src");
};

PhotoAlbum.prototype.bindDOM=function()
{
	var parent=this,
		curImgId=0;

	$(this._breviary).on("tap","canvas",function(){
		curImgId=this.id;
		parent._large.style.display="block";
		parent.loadImg(parent,curImgId);
	});
	$(this._large).on("tap",function(){
		parent._large.style.display="none";
	}).on("swipeRight",function(){
        var lastImgId=curImgId-1;
        if(lastImgId>=0){
	        parent.loadImg(parent,lastImgId,"swipeRight",function(){
		        parent._largeCvs.addEventListener("webkitAnimationEnd",function(){
			        parent._largeCvs.removeAttribute("class");
			        parent._largeCvs.removeEventListener("webkitAnimationEnd");
		        },false);
		        curImgId=lastImgId;
	        });
		}
    }).on("swipeLeft",function(){
        var nextImgId=parseInt(curImgId)+1;
        if(nextImgId<parent._wholeCount){
            parent.loadImg(parent,nextImgId,"swipeLeft",function(){
	            parent._largeCvs.addEventListener("webkitAnimationEnd",function(){
		            parent._largeCvs.removeAttribute("class");
		            parent._largeCvs.removeEventListener("webkitAnimationEnd");
	            },false);
	            curImgId=nextImgId;
            });
        }
    });
};
