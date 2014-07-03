 /*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * 游戏渲染对象类
 */
(function(win){
   //渲染对象类   
   var _renderObj = win.RenderObj = Class.extend({
	   init:function(name)
	   {	
	     this.name = name||("Unnamed_"+(_renderObj.SID++));
		 //拥有者,指向场景对象
		 this.owner = null;
		 //x,y方向坐标
		 this.x = 0;
		 this.y = 0;
		 //对象宽度和高度
		 this.w = 0;
		 this.h = 0;	
		 //x,y方向的速度
		 this.dx = 0;
		 this.dy = 0;
		 //x,y方向的加速度
		 this.vx = 0;
		 this.vy = 0;
		 //角度
		 this.deg = 0;
		 //z-index
		 this.zIdx = 0;
		 //是否可见
		 this.isVisible = true;
	   },	        	   
	   //设置位置
	   moveTo:function(x,y)
       {
		   this.x = x||this.x;
		   this.y = y||this.y;
	   },    
	   //移动
	   move:function(xOff,yOff)
	   {
		   this.x += xOff;
		   this.y +=yOff;
	   },
	   //移动一小步
	   moveStep:function()
       {
          this.dx += this.vx;
		  this.dy += this.vy;
		  this.x += this.dx;
		  this.y += this.dy;
	   },
       //旋转deg度
       rot:function(deg)
       {
		  this.deg = deg;
	   }, 
	   //更新方法，每一帧调用	   
	   update:function()
       {
          this.moveStep();
	   },
       //渲染方法，每一帧调用,ctx是canvas环境
	   render:function(ctx)
       {
          return;
	   }
   });
   //记录renderObj编号
   _renderObj.SID = 0;
   _renderObj.ClassName = "RenderObj";
   //注册类到类工厂中
   ClassFactory.regClass(_renderObj.ClassName,_renderObj);
}(window))