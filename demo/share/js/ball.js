/*
* Ball弹球类
*/
(function(){
  //从引擎的RenderObj继承
   Ball = RenderObj.extend({
   init:function(name,r)
   {
	   //定义半径
	   this.r = r||10;
	   this.color = "white";
	   this._super(name);	  
   },
   //重写update
   update:function()
   {
	   var w = this.owner.w,
		   h = this.owner.h;
	   //到达边界改变速度方向
       if(this.x<this.r||this.x>w-this.r)
	   {
		   this.dx = -this.dx;
	   };
       if(this.y<this.r||this.y>h-this.r)
	   {
		   this.dy = -this.dy;
	   }
	   //调用父类方法
	   this._super();
   },
   //重写render方法
   render:function(ctx)
   {
     //画球填充中心
	 ctx.beginPath();	 
	 ctx.fillStyle = this.color;
	 ctx.arc(this.x,this.y,this.r-3,0,Math.PI*2);
	 ctx.fill();
     ctx.lineWidth = 2;
     //描边
	 ctx.beginPath();
	 ctx.strokeStyle ="white";
	 ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
	 ctx.stroke();
   }
  });
  Ball.ClassName = "Ball";
  //注册Ball类
  ClassFactory.regClass(Ball.ClassName,Ball);
}())